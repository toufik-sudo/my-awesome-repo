import { format, parseISO } from 'date-fns';
import type { BookingResponse } from '../bookings.api';

/**
 * Export bookings to CSV and trigger download
 */
export function exportBookingsToCSV(bookings: BookingResponse[], filename = 'booking-history') {
  const headers = [
    'Booking ID',
    'Property',
    'City',
    'Guest Name',
    'Guest Email',
    'Check-in',
    'Check-out',
    'Nights',
    'Guests',
    'Price/Night',
    'Total Price',
    'Currency',
    'Status',
    'Payment Method',
    'Payment Status',
    'Created At',
  ];

  const rows = bookings.map((b) => [
    b.id,
    b.property?.title || '',
    b.property?.city || '',
    `${b.guest?.firstName || ''} ${b.guest?.lastName || ''}`.trim(),
    b.guest?.email || '',
    format(parseISO(b.checkInDate), 'yyyy-MM-dd'),
    format(parseISO(b.checkOutDate), 'yyyy-MM-dd'),
    b.numberOfNights,
    b.numberOfGuests,
    b.pricePerNight,
    b.totalPrice,
    b.currency || 'DZD',
    b.status,
    b.paymentMethod,
    b.paymentStatus,
    format(parseISO(b.createdAt), 'yyyy-MM-dd HH:mm'),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        const str = String(cell ?? '');
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
}

/**
 * Export bookings to a printable PDF (opens print dialog)
 */
export function exportBookingsToPDF(bookings: BookingResponse[], title = 'Booking History') {
  const rows = bookings.map((b) => `
    <tr>
      <td>${b.property?.title || '-'}</td>
      <td>${`${b.guest?.firstName || ''} ${b.guest?.lastName || ''}`.trim() || '-'}</td>
      <td>${format(parseISO(b.checkInDate), 'dd MMM yyyy')}</td>
      <td>${format(parseISO(b.checkOutDate), 'dd MMM yyyy')}</td>
      <td style="text-align:center">${b.numberOfNights}</td>
      <td style="text-align:center">${b.numberOfGuests}</td>
      <td style="text-align:right">${Number(b.totalPrice).toLocaleString()} DA</td>
      <td><span class="status status-${b.status}">${b.status}</span></td>
      <td>${b.paymentMethod?.replace('_', ' ') || '-'}</td>
    </tr>
  `).join('');

  const totalRevenue = bookings
    .filter((b) => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 32px; font-size: 12px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #0088b5; }
        .header h1 { font-size: 22px; color: #0088b5; }
        .header .date { color: #666; font-size: 12px; }
        .summary { display: flex; gap: 24px; margin-bottom: 20px; }
        .summary-card { padding: 12px 16px; background: #f0f9ff; border-radius: 8px; border-left: 3px solid #0088b5; }
        .summary-card .label { font-size: 10px; text-transform: uppercase; color: #666; letter-spacing: 0.5px; }
        .summary-card .value { font-size: 18px; font-weight: 700; color: #0088b5; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #0088b5; color: white; padding: 10px 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
        th:first-child { border-radius: 6px 0 0 0; }
        th:last-child { border-radius: 0 6px 0 0; }
        td { padding: 8px; border-bottom: 1px solid #e8e8e8; font-size: 11px; }
        tr:nth-child(even) { background: #fafafa; }
        tr:hover { background: #f0f9ff; }
        .status { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; text-transform: capitalize; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-completed { background: #cce5ff; color: #004085; }
        .status-cancelled, .status-rejected { background: #f8d7da; color: #721c24; }
        .status-counter_offer { background: #d1ecf1; color: #0c5460; }
        .footer { margin-top: 24px; text-align: center; color: #999; font-size: 10px; border-top: 1px solid #eee; padding-top: 12px; }
        @media print { body { padding: 16px; } .summary-card { break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 ${title}</h1>
        <div class="date">Generated: ${format(new Date(), 'dd MMM yyyy, HH:mm')}</div>
      </div>
      <div class="summary">
        <div class="summary-card">
          <div class="label">Total Bookings</div>
          <div class="value">${bookings.length}</div>
        </div>
        <div class="summary-card">
          <div class="label">Revenue (Confirmed + Completed)</div>
          <div class="value">${totalRevenue.toLocaleString()} DA</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Guest</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th style="text-align:center">Nights</th>
            <th style="text-align:center">Guests</th>
            <th style="text-align:right">Total</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">ByootDZ — Booking History Report</div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
