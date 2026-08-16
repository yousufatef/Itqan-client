import { Link } from 'react-router-dom';
import { CircleCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import AuthPageShell from '@/modules/auth/components/AuthPageShell';

function PasswordChangedPage() {
  const { t } = useTranslation();

  return (
    <AuthPageShell
      icon={<CircleCheck className='size-40 text-neutral-700' strokeWidth={1.25} aria-hidden='true' />}
      title={t('pages.passwordChanged.title')}
      description={t('pages.passwordChanged.description')}
    >
      <Button
        asChild
        className='type-body-md bg-primary-500 hover:bg-primary-600 h-12 w-full rounded-[4px] text-neutral-900'
      >
        <Link to='/login'>{t('pages.passwordChanged.login')}</Link>
      </Button>
    </AuthPageShell>
  );
}

export default PasswordChangedPage;
