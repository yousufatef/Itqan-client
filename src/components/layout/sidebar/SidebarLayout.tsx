import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import Logo from '@/assets/svgs/itqan-logo-white-bg.svg';
import {
  getMainNavSection,
  getRouteGroupKey,
  getSettingsNavSection,
} from './constants/sidebar.constants';
import type { CustomSidebarProps, SidebarNavEntry } from './types/sidebar.types';
import NavItem from './components/NavItem';
import ExpandableNavItem from './components/ExpandableNavItem';
import LogoutNavItem from './components/LogoutNavItem';
import SidebarUserMenu from './components/SidebarUserMenu';
import { useUser } from '@/modules/auth/hooks/useUser';
import { useLogoutApi } from '@/modules/auth/hooks/useLogoutApi';

function SidebarLayout({ side = 'left' }: CustomSidebarProps) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { user } = useUser();
  const { logOut, isLoading } = useLogoutApi();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const mainSection = getMainNavSection(t);
  const settingsSection = getSettingsNavSection(t);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const activeGroup = getRouteGroupKey(pathname);
    return activeGroup ? { [activeGroup]: true } : {};
  });

  useEffect(() => {
    const activeGroup = getRouteGroupKey(pathname);
    if (activeGroup) {
      setOpenGroups((prev) => ({ ...prev, [activeGroup]: true }));
    }
  }, [pathname]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openLogoutDialog = () => setLogoutOpen(true);
  const currentLang = i18n.language.startsWith('it') ? 'it' : 'en';

  const changeLanguage = async (nextLang: 'en' | 'it') => {
    await i18n.changeLanguage(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = 'ltr';
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } finally {
      setLogoutOpen(false);
    }
  };

  const renderNavEntry = (entry: SidebarNavEntry) => {
    if (entry.type === 'link') {
      return (
        <NavItem
          key={entry.key}
          end={entry.end}
          icon={entry.icon}
          to={entry.href}
          permissions={entry.permissions}
        >
          {entry.title}
        </NavItem>
      );
    }

    if (entry.type === 'group') {
      return (
        <ExpandableNavItem
          key={entry.key}
          title={entry.title}
          icon={entry.icon}
          items={entry.items}
          isOpen={!!openGroups[entry.key]}
          onToggle={() => toggleGroup(entry.key)}
        />
      );
    }


  };

  return (
    <>
      <Sidebar
        collapsible='offcanvas'
        side={side}
        style={{ '--sidebar-width': '240px' } as CSSProperties}
        className='border-r-0 bg-transparent data-[side=left]:border-r-0 data-[side=right]:border-l-0 **:data-[slot=sidebar-inner]:overflow-hidden **:data-[slot=sidebar-inner]:rounded-tr-[32px] **:data-[slot=sidebar-inner]:border-0 **:data-[slot=sidebar-inner]:bg-white'
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
              {mainSection.items.map(renderNavEntry)}
            </div>

            <div className='flex flex-col gap-1'>
              <p className='type-body-xs px-3 pb-1 text-neutral-400'>{t(settingsSection.labelKey)}</p>
              {settingsSection.items.map(renderNavEntry)}
            </div>
          </nav>
        </SidebarContent>

        <SidebarFooter className='mt-auto gap-3 border-t-0 bg-white px-3 py-4'>
          <button
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
          </button>

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
