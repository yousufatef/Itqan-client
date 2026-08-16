import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import AuthPageShell from '@/modules/auth/components/AuthPageShell';

export default function ExpiredPage() {
  const { t } = useTranslation();

  return (
    <AuthPageShell
      title={t('pages.errors.somethingWrong')}
      description={t('pages.errors.description')}
    >
      <div className='flex flex-col gap-4'>
        <Button
          type='button'
          className='type-body-md bg-primary-500 hover:bg-primary-600 h-12 w-full rounded-[4px] text-neutral-900'
          onClick={() => {
            window.history.back();
          }}
        >
          {t('pages.errors.goBack')}
        </Button>

        <Link
          to='/login'
          className='type-body-md text-primary-500 hover:text-primary-600 text-center underline underline-offset-4'
        >
          {t('pages.login.backToLogin')}
        </Link>
      </div>
    </AuthPageShell>
  );
}
