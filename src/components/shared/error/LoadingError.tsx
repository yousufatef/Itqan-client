import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function LoadingError({
  errorMsg,
  onRefetch,
  isRefetching,
}: {
  errorMsg?: ReactNode;
  onRefetch?: () => void;
  isRefetching?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className='my-5 flex flex-col items-center gap-2'>
      <div className='text-error-400 flex items-center justify-center gap-3 text-center text-xl font-medium'>
        <AlertCircle className='stroke-error-400' />
        <div>{errorMsg || t('errors.unexpectedTitle')}</div>
      </div>
      {onRefetch && (
        <Button
          variant={'link'}
          disabled={isRefetching}
          onClick={onRefetch}
        >
          {isRefetching ? <Spinner color='var(--neutral-300)' /> : t('common.refetch')}
        </Button>
      )}
    </div>
  );
}
