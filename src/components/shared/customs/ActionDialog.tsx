import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: React.ReactNode;
  children: ReactNode;
  ActionText: string;
  onConfirm: () => void;
  onCancel: () => void;
  cancelText?: string;
  mode?: 'default' | 'destructive';
  loading?: boolean;
  className?: string;
  icon?: ReactNode;
};

export default function ActionDialog({
  open,
  title,
  description,
  ActionText,
  cancelText,
  onConfirm,
  onCancel,
  children,
  loading,
  mode = 'default',
  className,
  icon,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && onCancel()}
    >
      <DialogContent
        className={cn(
          'flex max-h-[90%] flex-col gap-2 rounded-md border-neutral-50 p-0 sm:min-h-41 sm:max-w-115.25 [&>button[data-slot="dialog-close"]]:hidden',
          className,
        )}
      >
        <DialogHeader className='type-heading-sm flex flex-row items-start justify-between gap-2 border-b border-neutral-50 p-4 text-neutral-900'>
          <div className='flex items-start gap-2'>
            {icon && <div className='min-h-10 min-w-10'>{icon}</div>}
            <div className='flex flex-col gap-2'>
              <DialogTitle className='type-heading-sm! text-neutral-900'>{title}</DialogTitle>
              <DialogDescription className='text-neutral-400'>{description}</DialogDescription>
            </div>
          </div>
          <DialogClose className='hover:bg-primary-50 flex cursor-pointer items-center justify-center rounded p-2.5 transition-all'>
            <X className='size-5' />
          </DialogClose>
        </DialogHeader>

        <div className='flex-1 overflow-auto px-4 py-6'>{children}</div>

        <DialogFooter className='gap-4 border-t border-neutral-50 px-6 py-4'>
          <Button
            variant='outline'
            className='type-body-md border-primary-500 min-h-10 w-fit px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50'
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText || t('common.cancel')}
          </Button>

          <Button
            variant={mode === 'destructive' ? 'destructive' : 'default'}
            className={`type-body-md min-h-10 w-fit border-0 px-4 py-2.5 transition-all ${mode === 'destructive' ? 'bg-error-500 hover:bg-error-600 focus:ring-error-400' : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-400'} text-white`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Spinner /> : ActionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
