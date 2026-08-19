import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import Logo from '@/assets/svgs/itqan-logo-white-bg.svg';
import {
  getMainNavSection,
} from './constants/sidebar.constants';
import type { CustomSidebarProps } from './types/sidebar.types';
import NavItem from './components/NavItem';
import LogoutNavItem from './components/LogoutNavItem';
import SidebarUserMenu from './components/SidebarUserMenu';
import { useUser } from '@/modules/auth/hooks/useUser';
import { useLogoutApi } from '@/modules/auth/hooks/useLogoutApi';

function SidebarLayout({ side = 'left' }: CustomSidebarProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const { logOut, isLoading } = useLogoutApi();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const mainSection = getMainNavSection(t);
  const openLogoutDialog = () => setLogoutOpen(true);
  const handleLogout = async () => {
    try {
      await logOut();
    } finally {
      setLogoutOpen(false);
    }
  };

  return (
    <>
      <Sidebar
        collapsible='offcanvas'
        side={side}
        style={{ '--sidebar-width': '240px' } as CSSProperties}
        className='border-0 bg-transparent **:data-[slot=sidebar-inner]:overflow-hidden **:data-[slot=sidebar-inner]:border-0 **:data-[slot=sidebar-inner]:bg-white'
      >
        <SidebarHeader className='border-b px-4 pt-8 pb-6 mb-8'>
          <div className='flex items-center justify-center'>
            <img
              alt='ITQAN'
              className='h-14 w-[250px] object-contain'
              src={Logo}
            />
          </div>
        </SidebarHeader>

        <SidebarContent className='gap-0  py-2'>
          <nav className='flex flex-col gap-6'>
            <div className='flex flex-col gap-1'>
              <p className='type-body-xs px-3 pb-1 text-neutral-400'>{t(mainSection.labelKey)}</p>
              {mainSection.items.map((entry) =>
                entry.type === 'link' ? (
                  <NavItem
                    key={entry.key}
                    end={entry.end}
                    icon={entry.icon}
                    to={entry.href}
                    permissions={entry.permissions}
                  >
                    {entry.title}
                  </NavItem>
                ) : null,
              )}
            </div>

          </nav>
        </SidebarContent>

        <SidebarFooter className='mt-auto gap-3 border-t-0 bg-white px-3 py-4'>
          {/* <button
            type='button'
            onClick={() => {
              void changeLanguage(currentLang === 'en' ? 'it' : 'en');
            }}
            className='type-link-md flex h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-neutral-700 transition-colors hover:bg-neutral-50'
          >
            <Languages className='size-5 shrink-0' aria-hidden='true' />
            <span className='min-w-0 flex-1 truncate text-start'>
              {currentLang === 'en' ? 'IT' : 'EN'}
            </span>
          </button> */}

          <LogoutNavItem
            key='logout'
            title={t('sidebar.userMenu.logOut')}
            onLogoutClick={openLogoutDialog}
          />

          <SidebarUserMenu
            name={user?.fullName ?? ''}
            email={user?.email ?? ''}
            avatarUrl={user?.profilePicture}
          />
        </SidebarFooter>
      </Sidebar>

      <ConfirmDialog
        open={logoutOpen}
        title={t('sidebar.userMenu.logoutTitle')}
        description={
          <p className='text-muted-foreground'>{t('sidebar.userMenu.logoutDescription')}</p>
        }
        confirmText={t('sidebar.userMenu.logoutConfirm')}
        cancelText={t('sidebar.userMenu.logoutCancel')}
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
        loading={isLoading}
        mode='destructive'
        className='sm:max-w-86.5'
      />
    </>
  );
}

export default SidebarLayout;
