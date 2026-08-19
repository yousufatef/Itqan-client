import type { ReactNode } from 'react';
import Logo from '@/assets/svgs/itqan-logo-white-bg.svg';

type AuthPageShellProps = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
};

function AuthPageShell({ title, description, icon, children }: AuthPageShellProps) {
  return (
    <section className='mx-auto flex w-full max-w-[400px] flex-col items-center'>
      <img
        src={Logo}
        alt='Itqan'
        className='mb-8 h-10 w-[232px] object-contain'
      />

      {icon ? <div className='mb-8 flex justify-center'>{icon}</div> : null}

      <div className='mb-8 flex w-full flex-col items-center gap-2 text-center'>
        <h1 className='type-heading-xl text-neutral-900'>{title}</h1>
        {description ? (
          <p className='type-body-lg text-neutral-400'>{description}</p>
        ) : null}
      </div>

      <div className='w-full'>{children}</div>
    </section>
  );
}

export default AuthPageShell;
