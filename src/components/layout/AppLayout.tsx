import { Suspense, useEffect, useRef, type CSSProperties } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import MainLoader from '../shared/loader/MainLoader';
import { CustomSidebar } from '../shared/customs';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { TooltipProvider } from '../ui/tooltip';
import { useDirection } from '../../i18n/useDirection';
import { useUser } from '@/modules/auth/hooks/useUser';
import MobileHeader from './header/MobileHeader';

function AppLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);
  const direction = useDirection();
  const sidebarSide = direction === 'rtl' ? 'right' : 'left';

  useEffect(() => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  const { isAuthenticated, isLoading, isError } = useUser();

  if (isAuthenticated && isLoading) {
    return <MainLoader className='size-full' />;
  }

  if (isError) return <Navigate to={'/login'} />;

  return (
    <TooltipProvider>
      <SidebarProvider
        dir='rtl'
        style={
          {
            '--sidebar-width': '220px',
          } as CSSProperties
        }
      >
        <CustomSidebar side={sidebarSide} />
        <SidebarInset className='h-dvh overflow-hidden'>
          <MobileHeader />
          <div
            ref={mainRef}
            className='bg-background min-h-0 flex-1 overflow-y-auto p-6 text-start md:p-10'
          >
            <Suspense fallback={<MainLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default AppLayout;
