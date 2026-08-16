import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className='mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center'>
      <h1 className='text-3xl font-bold'>{t('errors.notFoundTitle')}</h1>
      <p className='text-sm text-neutral-500'>{t('errors.notFoundHint')}</p>
      <Link
        className='rounded-md border px-4 py-2 text-sm'
        to='/'
      >
        {t('errors.backHome')}
      </Link>
    </main>
  );
}

export default NotFoundPage;
