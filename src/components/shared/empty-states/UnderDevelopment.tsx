import { Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type UnderDevelopmentProps = {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'simple' | 'illustrated';
};

function UnderDevelopment({
  title,
  description,
  className = '',
  variant = 'illustrated',
}: UnderDevelopmentProps) {
  const { t } = useTranslation();

  const resolvedTitle = title ?? t('emptyStates.underDevelopment.title');
  const resolvedDescription = description ?? t('emptyStates.underDevelopment.description');
  const resolvedStatus = t('emptyStates.underDevelopment.status');

  if (variant === 'illustrated') {
    return (
      <div className={`flex min-h-[60vh] items-center justify-center ${className}`}>
        <div className='flex max-w-md flex-col items-center gap-6 px-6 text-center'>
          {/* Custom Illustration */}
          <Construction className='h-12 w-12 opacity-90 text-primary-500' strokeWidth={1.5} aria-hidden='true' />

          {/* Content */}
          <div className='flex flex-col gap-3'>
            <h2 className='type-heading-lg text-neutral-900'>{resolvedTitle}</h2>
            <p className='type-body-md text-neutral-500'>{resolvedDescription}</p>
          </div>

          {/* Progress indicator */}
          <div className='mt-2 flex items-center gap-2 rounded-full bg-neutral-50 px-4 py-2'>
            <div className='bg-primary-500 size-2 animate-pulse rounded-full' />
            <span className='type-body-sm font-medium text-neutral-600'>{resolvedStatus}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-[60vh] items-center justify-center ${className}`}>
      <div className='flex max-w-md flex-col items-center gap-4 px-6 text-center'>
        {/* Icon Container */}
        <div className='relative'>
          {/* Background Circle */}
          <div className='bg-primary-50 absolute inset-0 -m-4 rounded-full opacity-20' />

          {/* Icon */}
          <div className='bg-primary-50 relative rounded-full p-6'>
            <Construction
              className='text-primary-500 size-12'
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Content */}
        <div className='flex flex-col gap-2'>
          <h2 className='type-heading-md text-neutral-900'>{resolvedTitle}</h2>
          <p className='type-body-md text-neutral-500'>{resolvedDescription}</p>
        </div>

        {/* Progress indicator */}
        <div className='mt-2 flex items-center gap-2'>
          <div className='bg-primary-500 size-2 animate-pulse rounded-full' />
          <span className='type-body-sm text-neutral-400'>{resolvedStatus}</span>
        </div>
      </div>
    </div>
  );
}

export default UnderDevelopment;
