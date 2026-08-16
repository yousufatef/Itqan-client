import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export type ModalFormLayoutProps = {
  children: React.ReactNode;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
  footerClassName?: string;
};

export default function ModalFormLayout({
  children,
  onCancel,
  submitLabel = 'Create',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  disabled = false,
  className,
  footerClassName,
}: ModalFormLayoutProps) {
  return (
    <div className={cn('flex max-h-full flex-col gap-4', className)}>
      <div className='min-h-0 flex-1 overflow-y-auto'>{children}</div>
      <div className={cn('grid w-full grid-cols-2 gap-4', footerClassName)}>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={disabled || isSubmitting}
        >
          {cancelLabel}
        </Button>
        <Button
          type='submit'
          disabled={disabled || isSubmitting}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
