import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { useTranslation } from 'react-i18next';
import { Spinner } from '../ui/spinner';

type SubmitButtonProps = {
  label?: string;
  className?: string;
};

const SubmitButton = ({ label, className }: SubmitButtonProps) => {
  const { t } = useTranslation();
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button
      type='submit'
      className={cn('w-full', className)}
      disabled={isSubmitting}
    >
      {isSubmitting ? <Spinner /> : label || t('common.submit')}
    </Button>
  );
};

export default SubmitButton;
