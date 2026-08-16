import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import MainHeader from './header/MainHeader';

import type { FormModeProps, MainModeProps } from '@/types/layout.types';


type PageLayoutProps = (MainModeProps | FormModeProps) & {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
};

const PageLayout = ({ children, className, wrapperClassName, ...props }: PageLayoutProps) => {
  return (
    <section className={cn('flex w-full flex-col', wrapperClassName)}>
      <MainHeader {...props} />

      <div className={cn('flex w-full flex-1 flex-col gap-4 ', className)}>
        {children}
      </div>
    </section>
  );
};

export default PageLayout;
