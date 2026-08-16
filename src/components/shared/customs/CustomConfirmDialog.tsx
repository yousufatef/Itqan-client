import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type ConfirmDialogProps = {
  open: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
  mode?: 'default' | 'destructive';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading,
  mode = 'default',
  className,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && onCancel()}
    >
      <DialogContent
        className={cn(
          'gap-2 rounded-md border-neutral-50 px-7 py-4 sm:min-h-41 sm:max-w-115.25 [&>button[data-slot="dialog-close"]]:size-6 [&>button[data-slot="dialog-close"]>svg]:size-full',
          className,
        )}
      >
        <DialogHeader className='type-heading-sm text-neutral-900'>
          <DialogTitle className='type-heading-sm! mt-3 text-center'>{title}</DialogTitle>
        </DialogHeader>

        <div className='type-body-md text-secondary-400 max-w-full overflow-hidden text-center text-neutral-400'>
          {description}
        </div>

        <DialogFooter className='mt-8 flex items-center justify-end gap-2'>
          <Button
            variant='outline'
            className='type-body-md border-primary-500 min-h-10 w-1/2 px-4 py-2.5 text-neutral-700 hover:bg-neutral-100 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50'
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={mode === 'destructive' ? 'destructive' : 'default'}
            className={`type-body-md min-h-10 w-1/2 border-0 px-4 py-2.5 transition-all ${mode === 'destructive' ? 'bg-error-500 hover:bg-error-600 focus:ring-error-400' : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-400'} text-white`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Spinner /> : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
