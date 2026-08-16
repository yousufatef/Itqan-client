import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

export default function ResetPasswordInstructions() {
  const { t } = useTranslation();

  return (
    <div className='flex gap-2 rounded bg-neutral-50 p-2 text-neutral-900'>
      {/* icon */}
      <Info className='h-4 w-4 text-neutral-900' aria-hidden='true' />

      <div className='flex flex-1 flex-col gap-1'>
        <h4 className='font-medium'>{t('users.resetPassword.instructionsTitle')}</h4>
        <ol className='list-decimal ps-4 text-sm'>
          <li>{t('users.resetPassword.instruction1')}</li>
          <li>{t('users.resetPassword.instruction2')}</li>
          <li>{t('users.resetPassword.instruction3')}</li>
          <li>{t('users.resetPassword.instruction4')}</li>
        </ol>
      </div>
    </div>
  );
}
