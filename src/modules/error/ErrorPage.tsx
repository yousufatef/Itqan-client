
import { useTranslation } from 'react-i18next';
import Logo from '@/assets/svgs/itqan-logo-white-bg.svg';

export default function ErrorPage() {
  const { t } = useTranslation();

  return (
    <main
      className='flex min-h-screen items-center justify-center px-6'
    >
      <section className='flex flex-col items-center text-center'>
        <img src={Logo} alt='Itqan' className='mb-8 h-11 w-40 object-contain sm:h-10 sm:w-44' />

        <h1 className='type-heading-xl mb-2'>{t('pages.errors.somethingWrong')}</h1>

        <p className='type-body-lg text-neutral-400'>{t('pages.errors.description')}</p>
      </section>
    </main>
  );
}
