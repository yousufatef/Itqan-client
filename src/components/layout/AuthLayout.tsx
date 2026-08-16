import { Outlet } from 'react-router-dom';

import useScrollToTop from '@/hooks/useScrollToTop';

import { LanguageSwitcher } from '@/i18n/components/LanguageSwitcher';

function AuthLayout() {
  useScrollToTop();

  return (
    <div className='relative min-h-screen w-full bg-background'>
      <LanguageSwitcher />
      <main className='relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-10 max-md:px-4'>
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
