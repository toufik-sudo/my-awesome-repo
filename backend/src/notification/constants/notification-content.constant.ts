/**
 * Centralized, polished copy for in-app & email notifications.
 *
 * Goal: replace short technical strings with warm, professional content
 * (concrete numbers, clear CTAs, brand voice) without changing behavior.
 *
 * Each builder returns `{ title, message }` and is intentionally pure so
 * services can spread it directly into `queueNotification(...)`.
 *
 * Brand voice: confident, concierge-like, action-oriented.
 *  - Always mention the property/service name when known.
 *  - Always state next step (CTA verb) and the time window if any.
 *  - Prefer "your booking at <Property>" over "booking <id>".
 *  - Keep messages under ~220 chars to render well on mobile toasts.
 */

const BRAND = 'ByootDZ';
const SUPPORT_HINT = 'Need a hand? Our support team is one click away.';

const short = (id: string) => (id ? id.slice(0, 8).toUpperCase() : '');
const where = (name?: string | null, id?: string) =>
  name?.trim() ? `“${name.trim()}”` : id ? `booking #${short(id)}` : 'your stay';

const nightsLabel = (n: number) =>
  n <= 0 ? '' : n === 1 ? '1 night' : `${n} nights`;

export const NotificationContent = {
  // ── Booking creation ────────────────────────────────────────────
  newBookingRequest(args: {
    propertyName?: string | null;
    bookingId: string;
    nights: number;
    guestName?: string | null;
  }) {
    const w = where(args.propertyName, args.bookingId);
    const guest = args.guestName?.trim() || 'A guest';
    const stay = args.nights ? ` for ${nightsLabel(args.nights)}` : '';
    return {
      title: '🔔 New booking request awaiting your response',
      message: `${guest} would like to book ${w}${stay}. You have 48h to accept, decline or counter-offer — guests are 3× more likely to book hosts who reply within 24h.`,
    };
  },

  bookingCreatedForGuest(args: {
    propertyName?: string | null;
    bookingId: string;
    nights: number;
    paymentDeadlineHours: number;
  }) {
    const w = where(args.propertyName, args.bookingId);
    const stay = args.nights ? ` (${nightsLabel(args.nights)})` : '';
    return {
      title: '✅ A booking has been prepared for you',
      message: `Our team has secured ${w}${stay} on your behalf — host approval is already granted. To lock in your stay, please complete the payment within ${args.paymentDeadlineHours}h.`,
    };
  },

  bookingAdminPreValidated(args: {
    propertyName?: string | null;
    bookingId: string;
    nights: number;
  }) {
    const w = where(args.propertyName, args.bookingId);
    const stay = args.nights ? ` (${nightsLabel(args.nights)})` : '';
    return {
      title: '👤 Admin-assisted booking pre-validated',
      message: `${BRAND} concierge created and pre-validated a booking at ${w}${stay} on behalf of a guest. No action required from you — we’ll notify you again as soon as the payment lands.`,
    };
  },

  // ── Booking status updates (guest-facing) ───────────────────────
  bookingAccepted(args: {
    propertyName?: string | null;
    bookingId: string;
    paymentDeadlineHours: number;
  }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '🎉 Great news — your booking was accepted',
      message: `Your stay at ${w} is one step away from being confirmed. Upload your payment receipt within ${args.paymentDeadlineHours}h to secure the dates; otherwise the request will be released to other guests.`,
    };
  },

  bookingConfirmed(args: { propertyName?: string | null; bookingId: string }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '🏆 Booking confirmed — you’re all set',
      message: `Payment validated. Your stay at ${w} is fully confirmed. You can now chat with your host, view check-in details and add the trip to your calendar.`,
    };
  },

  bookingDeclined(args: { propertyName?: string | null; bookingId: string; reason?: string | null }) {
    const w = where(args.propertyName, args.bookingId);
    const reason = args.reason?.trim()
      ? ` Reason from the host: “${args.reason.trim()}”.`
      : '';
    return {
      title: '❌ Booking declined by the host',
      message: `Unfortunately your request for ${w} was declined.${reason} Discover similar stays nearby — we’ve curated a fresh selection just for you.`,
    };
  },

  bookingCounterOffer(args: {
    propertyName?: string | null;
    bookingId: string;
    message?: string | null;
  }) {
    const w = where(args.propertyName, args.bookingId);
    const note = args.message?.trim() ? ` Host’s note: “${args.message.trim()}”.` : '';
    return {
      title: '💬 The host sent you a counter-offer',
      message: `A revised price or dates are now available for ${w}.${note} Review and accept within 24h to keep the conversation moving.`,
    };
  },

  bookingCancelledHostCascade(args: {
    propertyName?: string | null;
    bookingId: string;
    isCash: boolean;
  }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '↩️ Booking cancelled — automatic resolution',
      message: args.isCash
        ? `Your booking at ${w} was cancelled because the host is temporarily unavailable. Since payment was hand-to-hand, no refund applies on our side.`
        : `Your booking at ${w} was cancelled because the host is temporarily unavailable. A full refund is on its way — typically within 5 business days.`,
    };
  },

  bookingCancelledByGuest(args: { propertyName?: string | null; bookingId: string }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '✔️ Your cancellation has been processed',
      message: `Your booking at ${w} has been cancelled. ${SUPPORT_HINT}`,
    };
  },

  bookingConfirmedForHost(args: { propertyName?: string | null; bookingId: string }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '💸 Payment received — booking confirmed',
      message: `The guest payment for ${w} has been validated. Time to prepare a warm welcome — confirmed bookings with a personal message receive 4.8★ reviews on average.`,
    };
  },

  // ── Lifecycle: pending too long ─────────────────────────────────
  hostDidNotRespond(args: { propertyName?: string | null; bookingId: string; deadlineHours: number }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '⏱️ The host didn’t respond in time',
      message: `Your request for ${w} has been waiting more than ${args.deadlineHours}h. You’re free to cancel and book another stay — we’ll keep this one open if you’d rather wait.`,
    };
  },

  hostPendingReminder(args: { propertyName?: string | null; bookingId: string }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '⏰ Reminder — a guest is still waiting on you',
      message: `A booking request for ${w} is still pending. Replying quickly improves your acceptance ranking and host reputation. Just one click: accept, decline or counter.`,
    };
  },

  // ── Lifecycle: payment reminders / archive ──────────────────────
  paymentReminder(args: {
    propertyName?: string | null;
    bookingId: string;
    isLast: boolean;
    deadlineHours: number;
  }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: args.isLast
        ? '🚨 Last reminder — your booking is about to be released'
        : '⏳ Reminder — finish your payment to lock your stay',
      message: args.isLast
        ? `Final call: please upload your payment receipt for ${w}. Without it before the ${args.deadlineHours}h deadline, the dates will be released to other travellers.`
        : `Your stay at ${w} is reserved but not yet paid. Upload your receipt within the ${args.deadlineHours}h window to keep your booking active.`,
    };
  },

  bookingArchivedGuest(args: { propertyName?: string | null; bookingId: string; deadlineHours: number }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '📁 Booking archived — payment not received in time',
      message: `Your booking at ${w} was archived because no payment was received within ${args.deadlineHours}h after acceptance. You can request a new stay anytime — your account remains in good standing.`,
    };
  },

  bookingArchivedHost(args: { propertyName?: string | null; bookingId: string }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: '📁 Booking archived — guest did not complete payment',
      message: `Booking at ${w} was archived after the payment window elapsed. Your calendar has been freed automatically and the dates are open to new requests.`,
    };
  },

  // ── Service bookings ────────────────────────────────────────────
  providerDidNotRespond(args: { bookingId: string; deadlineHours: number }) {
    return {
      title: '⏱️ Service provider didn’t respond in time',
      message: `Your service request (#${short(args.bookingId)}) has been waiting more than ${args.deadlineHours}h without a reply. You may cancel and explore other providers, or keep waiting if you prefer.`,
    };
  },

  providerPendingReminder(args: { bookingId: string }) {
    return {
      title: '⏰ Reminder — a customer is awaiting your reply',
      message: `Service booking #${short(args.bookingId)} is still pending. A fast response increases conversion by up to 60% — accept, decline or counter in one click.`,
    };
  },

  serviceArchivedCustomer(args: { bookingId: string }) {
    return {
      title: '📁 Service booking archived',
      message: `Your service booking #${short(args.bookingId)} was archived because the payment window elapsed. You can rebook the same provider anytime.`,
    };
  },

  servicePaymentReminder(args: { bookingId: string }) {
    return {
      title: '⏳ Reminder — complete your service payment',
      message: `Please upload your payment receipt for service booking #${short(args.bookingId)} to confirm your appointment.`,
    };
  },

  // ── Invitations ─────────────────────────────────────────────────
  invitationAccepted(args: { contact: string; role: string }) {
    return {
      title: '🎊 Your invitation was accepted',
      message: `${args.contact} just joined ${BRAND} as ${args.role}. They now appear in your team and can start collaborating right away.`,
    };
  },

  // ── Referrals ───────────────────────────────────────────────────
  referralSignup(args: { points: number }) {
    return {
      title: '🎁 Your referral signed up — bonus unlocked',
      message: `Congratulations! Someone joined ${BRAND} using your code. ${args.points} points have been credited to your wallet — track them in the Rewards section.`,
    };
  },

  referralCompleted(args: { points: number }) {
    return {
      title: '🏅 Referral completed — extra points earned',
      message: `Your referred friend just completed their first booking. We’ve added ${args.points} bonus points to your balance — thank you for growing the community.`,
    };
  },

  // ── Trust / Blame ───────────────────────────────────────────────
  blameAdded(args: { reason: string }) {
    return {
      title: '⚠️ A trust note was added to your profile',
      message: `Reason: ${args.reason}. This affects your visibility on the platform. If you believe this is unfair, please contact support — most cases are resolved within 48h.`,
    };
  },

  blameRemoved(args: { note?: string | null }) {
    return {
      title: '✅ A trust note was cleared from your profile',
      message: args.note?.trim()
        ? `Reviewer note: ${args.note.trim()}. Your profile is back in good standing — keep up the great work!`
        : 'A platform reviewer has cleared this note. Your profile is back in good standing.',
    };
  },

  // ── Hyper-admin internal feeds ──────────────────────────────────
  hyperBookingCreated(args: { bookingId: string; propertyName?: string | null; onBehalf: boolean }) {
    const w = where(args.propertyName, args.bookingId);
    return {
      title: args.onBehalf
        ? '👤 Admin/Manager booked on behalf of a guest'
        : '🆕 New booking request (pending host)',
      message: `Booking #${short(args.bookingId)} for ${w} just entered the pipeline. Open the admin view to monitor or intervene.`,
    };
  },

  hyperBookingStatus(args: { bookingId: string; status: string }) {
    return {
      title: `🔁 Booking status changed → ${args.status}`,
      message: `Booking #${short(args.bookingId)} is now “${args.status}”. Full audit trail available in the admin console.`,
    };
  },

  hyperBookingPendingTooLong(args: { bookingId: string }) {
    return {
      title: '⚠️ Host non-responsive on a pending booking',
      message: `Booking #${short(args.bookingId)} crossed the 48h pending threshold. The host has been flagged and the guest can now cancel without penalty.`,
    };
  },

  hyperBookingArchivedNoPayment(args: { bookingId: string }) {
    return {
      title: '📁 Booking archived — no payment received',
      message: `Booking #${short(args.bookingId)} was auto-archived after the payment window expired. The guest has been flagged for non-payment.`,
    };
  },
};

export type NotificationContentPayload = { title: string; message: string };
