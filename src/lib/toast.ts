import { toast as sonnerToast, type ExternalToast } from 'sonner';

export type ToastType =
  | 'normal'
  | 'action'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'loading'
  | 'default';

/** @deprecated Use `type` instead */
export type ToastVariant = 'default' | 'destructive';

export type ToastPayload = {
  title: string;
  description?: string;
  type?: ToastType;
  /** @deprecated Use `type: 'error'` instead */
  variant?: ToastVariant;
} & Omit<ExternalToast, 'description'>;

function resolveToastType(payload: ToastPayload): ToastType {
  if (payload.type) return payload.type;
  if (payload.variant === 'destructive') return 'error';
  return 'default';
}

export function toast(payload: ToastPayload) {
  const { title, description, type, variant, ...options } = payload;
  const toastType = resolveToastType({ title, description, type, variant });
  const externalToast = { description, ...options };

  switch (toastType) {
    case 'success':
      return sonnerToast.success(title, externalToast);
    case 'error':
      return sonnerToast.error(title, externalToast);
    case 'warning':
      return sonnerToast.warning(title, externalToast);
    case 'info':
      return sonnerToast.info(title, externalToast);
    case 'loading':
      return sonnerToast.loading(title, externalToast);
    case 'action':
    case 'normal':
    case 'default':
    default:
      return sonnerToast(title, externalToast);
  }
}

toast.success = sonnerToast.success;
toast.error = sonnerToast.error;
toast.warning = sonnerToast.warning;
toast.info = sonnerToast.info;
toast.loading = sonnerToast.loading;
toast.message = sonnerToast.message;
toast.promise = sonnerToast.promise;
toast.custom = sonnerToast.custom;
toast.dismiss = sonnerToast.dismiss;
toast.getHistory = sonnerToast.getHistory;
toast.getToasts = sonnerToast.getToasts;
