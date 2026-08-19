import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface MainHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  primaryLabel?: ReactNode;
  secondaryLabel?: ReactNode;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  showPrimaryButton?: boolean;
  showSecondaryButton?: boolean;
  isPrimaryLoading?: boolean;
  isSecondaryLoading?: boolean;
}

export default function MainHeader({
  title,
  subtitle,
  actions,
  primaryLabel,
  secondaryLabel = 'تصدير',
  onPrimaryClick,
  onSecondaryClick,
  showPrimaryButton = false,
  showSecondaryButton = false,
  isPrimaryLoading = false,
  isSecondaryLoading = false,
}: MainHeaderProps) {
  const showDefaultActions = !actions && (showPrimaryButton || showSecondaryButton);

  return (
    <div className='mb-4 flex flex-col justify-between gap-4 sm:mb-6 sm:flex-row sm:items-end md:mb-8'>
      <div className='min-w-0'>
        <h1 className='type-heading-xl'>{title}</h1>

        {subtitle && <p className='type-body-md mt-2 text-neutral-400'>{subtitle}</p>}
      </div>

      {actions}

      {showDefaultActions && (
        <div className='flex flex-wrap items-center gap-3'>
          {showSecondaryButton && (
            <Button
              type='button'
              variant='outline'
              onClick={onSecondaryClick}
              className='type-body-md! border-primary-500 min-h-12 w-fit bg-transparent px-4 py-3.5 text-neutral-700 hover:bg-neutral-100 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
            >
              {isSecondaryLoading ? <Spinner /> : secondaryLabel}
            </Button>
          )}

          {showPrimaryButton && (
            <Button
              type='button'
              onClick={onPrimaryClick}
              disabled={isPrimaryLoading}
              className='type-body-md! bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 min-h-12 w-fit border-0 px-4 py-3.5 text-neutral-900 focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
            >
              {isPrimaryLoading ? <Spinner /> : primaryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
