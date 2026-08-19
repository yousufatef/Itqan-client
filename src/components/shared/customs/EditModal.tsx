import { type Dispatch, type SetStateAction } from 'react';
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
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import LoadingOverlay from '../loader/LoadingOverlay';
import { Spinner } from '@/components/ui/spinner';
import { useFormContext } from 'react-hook-form';

type EditModalProps = {
  isOpen: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  submitLabel?: string;
  cancelLabel?: string;
  formId?: string;
  className?: string;
  contentClassName?: string;
  isLoading?: boolean;
  fullWidthSubmit?: boolean;
};

export default function EditModal({
  isOpen,
  toggle,
  title,
  children,
  submitLabel,
  cancelLabel = 'إلغاء',
  formId,
  className,
  contentClassName,
  isLoading,
  fullWidthSubmit = false,
  subtitle,
}: EditModalProps) {
  const { isValid } = useFormContext().formState;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={toggle}
    >
      <DialogContent
        showCloseButton={false}
        className={cn(
          'flex min-h-0 max-h-[90vh] flex-col gap-0 overflow-hidden rounded-xl p-0 md:max-w-xl lg:min-w-200',
          className,
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header — fixed at top */}
        <DialogHeader className='flex shrink-0 flex-row items-start justify-between gap-4 p-6 pb-4'>
          <div className='flex flex-col gap-1 pe-4'>
            <DialogTitle className='text-xl font-bold text-neutral-900 md:text-2xl'>
              {title}
            </DialogTitle>
            {subtitle ? (
              <DialogDescription className='type-body-sm text-neutral-500'>
                {subtitle}
              </DialogDescription>
            ) : null}
          </div>
          {!isLoading && (
            <DialogClose className='cursor-pointer rounded-md transition-all hover:bg-neutral-50'>
              <X className='size-8' />
            </DialogClose>
          )}
        </DialogHeader>

        {/* Content + Footer wrapper — overlay covers this area only */}
        <div className='relative flex min-h-0 flex-1 flex-col'>
          {/* Scrollable content area */}
          <div className='min-h-0 flex-1 overflow-y-auto px-6'>
            <div
              className={cn(
                'grid w-full grid-cols-1 items-start gap-4 p-1 xl:grid-cols-2',
                contentClassName,
              )}
            >
              {children}
            </div>
          </div>
          {isLoading && <LoadingOverlay />}
        </div>

        {/* Footer — fixed at bottom */}
        {formId && (
          <DialogFooter className='shrink-0 p-6 pt-6'>
            {fullWidthSubmit ? (
              <Button
                form={formId}
                disabled={isLoading}
                className='bg-primary-500 hover:bg-primary-600 h-12 w-full rounded-lg text-base font-semibold text-neutral-900'
              >
                {isLoading ? <Spinner /> : submitLabel || 'Create'}
              </Button>
            ) : (
              <div className='grid w-full grid-cols-2 gap-4'>
                <Button
                  variant='outline'
                  onClick={() => toggle(false)}
                  disabled={isLoading}
                  className='h-12'
                >
                  {cancelLabel}
                </Button>
                <Button
                  form={formId}
                  disabled={isLoading || !isValid}
                  className='bg-primary-500 hover:bg-primary-600 h-12 text-white'
                >
                  {isLoading ? <Spinner /> : submitLabel || 'حفظ'}
                </Button>
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
