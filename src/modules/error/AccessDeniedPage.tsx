
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AccessDeniedPage() {
  const { t } = useTranslation();
  return (
    <section className='flex size-full flex-col items-center justify-center bg-transparent'>
      {/* <img
        src={luca-stayLogo}
        alt='luca-stay Logo'
        className='mb-8 h-11 w-40 items-center sm:h-10 sm:w-44'
      /> */}
      <h1 className='type-heading-xl mb-2'>{t('pages.errors.accessDenied')}</h1>
      <p className='type-body-lg text-neutral-400'>{t('pages.errors.accessDeniedDescription')}</p>
      <Link
        to={'/'}
        className='hover:text-primary-900 text-primary-500 mt-4 underline transition-all'
      >
        {t('errors.backHome')}
      </Link>
    </section>
  );
}
