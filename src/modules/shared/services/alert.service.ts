import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

/**
 * SweetAlert2 wrapper service - replaces sonner toast
 * Usage: import { swalAlert } from '@/modules/shared/services/alert.service';
 * 
 * swalAlert.success('Title', 'Description');
 * swalAlert.error('Title', 'Description');
 * swalAlert.warning('Title', 'Description');
 * swalAlert.info('Title', 'Description');
 * swalAlert('Title', { description: '...' });
 * swalAlert.confirm('Are you sure?', 'This action cannot be undone');
 */

const TOAST_TIMER = 3000;
const ALERT_TIMER = 5000;

// Shared mixin for toast-style (non-blocking, top-end)
const ToastMixin = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: TOAST_TIMER,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: 'swal-toast-popup',
  },
});

// Centered alert mixin (blocking, for confirmations)
const AlertMixin = Swal.mixin({
  customClass: {
    confirmButton: 'swal-confirm-btn',
    cancelButton: 'swal-cancel-btn',
    popup: 'swal-alert-popup',
  },
  buttonsStyling: false,
});

interface SwalAlertOptions {
  description?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
  icon?: SweetAlertIcon;
}

/**
 * Main alert function — shows a toast-style notification
 */
function swalAlert(title: string, options?: SwalAlertOptions | string): void {
  const opts: SwalAlertOptions = typeof options === 'string' 
    ? { description: options } 
    : (options || {});

  ToastMixin.fire({
    icon: opts.icon || 'info',
    title,
    text: opts.description,
    timer: opts.duration || TOAST_TIMER,
    showConfirmButton: !!opts.action,
    confirmButtonText: opts.action?.label,
  }).then((result: SweetAlertResult) => {
    if (result.isConfirmed && opts.action?.onClick) {
      opts.action.onClick();
    }
  });
}

swalAlert.success = (title: string, description?: string, duration?: number) => {
  ToastMixin.fire({
    icon: 'success',
    title,
    text: description,
    timer: duration || TOAST_TIMER,
  });
};

swalAlert.error = (title: string, description?: string, duration?: number) => {
  ToastMixin.fire({
    icon: 'error',
    title,
    text: description,
    timer: duration || ALERT_TIMER,
  });
};

swalAlert.warning = (title: string, description?: string, duration?: number) => {
  ToastMixin.fire({
    icon: 'warning',
    title,
    text: description,
    timer: duration || ALERT_TIMER,
  });
};

swalAlert.info = (title: string, description?: string, duration?: number) => {
  ToastMixin.fire({
    icon: 'info',
    title,
    text: description,
    timer: duration || TOAST_TIMER,
  });
};

/**
 * Confirmation dialog (blocking, centered)
 */
swalAlert.confirm = async (
  title: string, 
  description?: string,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
): Promise<boolean> => {
  const result = await AlertMixin.fire({
    title,
    text: description,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });
  return result.isConfirmed;
};

/**
 * Delete confirmation (red themed)
 */
swalAlert.confirmDelete = async (
  title: string,
  description?: string,
  confirmText = 'Delete',
  cancelText = 'Cancel'
): Promise<boolean> => {
  const result = await AlertMixin.fire({
    title,
    text: description,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    customClass: {
      confirmButton: 'swal-delete-btn',
      cancelButton: 'swal-cancel-btn',
      popup: 'swal-alert-popup',
    },
  });
  return result.isConfirmed;
};

/**
 * Loading state
 */
swalAlert.loading = (title: string, description?: string) => {
  Swal.fire({
    title,
    text: description,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: 'swal-alert-popup',
    },
  });
};

swalAlert.closeLoading = () => {
  Swal.close();
};

export { swalAlert };
export default swalAlert;
