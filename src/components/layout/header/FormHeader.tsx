import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  primaryLabel?: ReactNode;
  secondaryLabel?: ReactNode;
  onSecondaryClick?: () => void;
  showSecondaryButton?: boolean;
  primaryButtonProps?: React.ComponentProps<typeof Button>;
  secondaryButtonProps?: React.ComponentProps<typeof Button>;
  isPrimaryLoading?: boolean;
  isSecondaryLoading?: boolean;
}

export default function FormHeader({
  title,
  subtitle,
  onBack,
  primaryLabel = 'Save',
  secondaryLabel = 'Cancel',
  onSecondaryClick,
  showSecondaryButton = true,
  primaryButtonProps,
  secondaryButtonProps,
  isPrimaryLoading = false,
  isSecondaryLoading = false,
}: FormHeaderProps) {
  const form = useFormContext();
  const { isSubmitting, isSubmitSuccessful, isValid, isDirty } = form.formState;
  const isPrmiaryBtnDisabled =
    isSubmitting || isSubmitSuccessful || !isValid || !isDirty || isSecondaryLoading;
  const isSecondaryBtnDisabled = isSubmitting || isSubmitSuccessful || isPrimaryLoading;

  const isPrimaryBtnLoading = isPrimaryLoading || isSubmitting;

  return (
    <div className='flex items-start justify-between gap-4 border-b border-neutral-50 px-4 pb-6 md:px-6'>
      <div className='flex min-w-0 items-start gap-3'>
        {onBack && (
          <button
            type='button'
            onClick={onBack}
            className='mt-1 shrink-0 cursor-pointer'
          >
            <div className='rtl:rotate-180'>
              <svg
                width={20}
                height={20}
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g clipPath='url(#clip0_152_2442)'>
                  <path
                    d='M13.125 16.25L6.875 10L13.125 3.75'
                    stroke='#1A1D28'
                    strokeWidth='1.25'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_152_2442'>
                    <rect
                      width={20}
                      height={20}
                      fill='white'
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </button>
        )}

        <div className='min-w-0'>
          <h1 className='type-heading-sm'>{title}</h1>

          {subtitle && <p className='type-body-md mt-2 text-neutral-400'>{subtitle}</p>}
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        {showSecondaryButton && (
          <Button
            variant='outline'
            type='button'
            onClick={onSecondaryClick}
            {...secondaryButtonProps}
            className='type-body-md! border-primary-500 min-h-12 w-fit min-w-31 bg-transparent px-4 py-3.5 text-neutral-700 hover:bg-neutral-100 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
            disabled={
              secondaryButtonProps?.disabled || isSecondaryLoading || isSecondaryBtnDisabled
            }
          >
            {isSecondaryLoading ? <Spinner /> : secondaryLabel}
          </Button>
        )}

        <Button
          type='submit'
          className='bg-primary-500 type-body-md! min-h-12 w-fit min-w-31 border-0 px-4 py-3.5 text-white'
          {...primaryButtonProps}
          disabled={primaryButtonProps?.disabled || isPrimaryBtnLoading || isPrmiaryBtnDisabled}
        >
          {isPrimaryBtnLoading ? <Spinner /> : primaryLabel}
        </Button>
      </div>
    </div>
  );
}
// Usage example:
{
  /* <FormHeader
    title="Blog Details"
    subtitle="Edit blog content and preview how it will appear in the luca-stay app."
    onBack={() => navigate(-1)}
    primaryLabel="Publish"
    secondaryLabel="Save as Draft"
    onSecondaryClick={() => console.log('Save as draft')}
/> */
}
