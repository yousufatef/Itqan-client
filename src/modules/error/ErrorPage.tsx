
import { useTranslation } from 'react-i18next';
import AuthBg from '@/assets/svgs/Logo.svg';

export default function ErrorPage() {
  const { t } = useTranslation();

  return (
    <main
      className='flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6'
      style={{ backgroundImage: `url(${AuthBg})` }}
    >
      <section className='flex flex-col items-center text-center'>
        {/* <img
          src={luca-stayLogo}
          alt='luca-stay Logo'
          className='mb-8 h-11 w-40 sm:h-10 sm:w-44'
        /> */}

        <h1 className='type-heading-xl mb-2'>{t('pages.errors.somethingWrong')}</h1>

        <p className='type-body-lg text-neutral-400'>{t('pages.errors.description')}</p>
      </section>
    </main>
  );
}
