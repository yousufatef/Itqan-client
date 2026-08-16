import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ModalProps } from '@/types/components';

export const Modal = ({
  onClose,
  trigger,
  className,
  toggle,
  header,
  isOpen,
  children,
  forceModal,
  footer,
  headerClassName,
  footerClassName,
}: ModalProps) => {
  const handleOpenChange = (val: boolean) => {
    toggle?.(val);
    if (!val) {
      onClose?.();
    }
  };

  return (
    <Dialog
      open={isOpen}
      modal={forceModal}
      onOpenChange={handleOpenChange}
    >
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent
        forceMount
        className={cn(
          'flex max-h-[95%] min-w-72 flex-col overflow-hidden! p-0',
          {
            '[&>button.dialog-close]:hidden': onClose === undefined,
          },
          className,
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {header && (
          <DialogHeader
            className={cn(
              'w-full text-start! sm:text-start [&+button>svg]:max-sm:size-6',
              {},
              headerClassName,
            )}
          >
            {header}
          </DialogHeader>
        )}
        <div
          id='modal-content'
          className='min-h-0 w-fit max-w-full min-w-fit flex-1 basis-auto overflow-auto'
        >
          {children}
        </div>
        <DialogFooter className={cn('', footerClassName)}>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
