import type { TFunction } from 'i18next';
import { APP_PERMISSIONS } from '@/modules/auth/constants/permissions.constants';
import type { SidebarNavEntry, SidebarNavSection } from '../types/sidebar.types';

export function getMainNavSection(t: TFunction): SidebarNavSection {
  return {
    labelKey: 'sidebar.sections.main',
    items: [
      {
        type: 'link',
        key: 'users',
        title: t('sidebar.nav.users'),
        href: '/',
        icon: 'users',
        end: true,
        permissions: [APP_PERMISSIONS.users],
      },
      {
        type: 'link',
        key: 'students',
        title: t('sidebar.nav.students'),
        href: '/students',
        icon: 'students',
        permissions: [APP_PERMISSIONS.students],
      },
      {
        type: 'link',
        key: 'circles',
        title: t('sidebar.nav.circles'),
        href: '/circles',
        icon: 'circles',
        permissions: [APP_PERMISSIONS.circles],
      },
      {
        type: 'link',
        key: 'financial',
        title: t('sidebar.nav.financial'),
        href: '/financial',
        icon: 'financial',
        permissions: [APP_PERMISSIONS.financial],
      },
    ],
  };
}

export function getSettingsNavSection(t: TFunction): SidebarNavSection {
  return {
    labelKey: 'sidebar.sections.settings',
    items: [
      {
        type: 'link',
        key: 'settings',
        title: t('sidebar.nav.settings'),
        href: '/settings',
        icon: 'settings',
        permissions: [APP_PERMISSIONS.settings],
      },
    ],
  };
}

export function getRouteGroupKey(_pathname: string): string | null {
  return null;
}

export type { SidebarNavEntry };
