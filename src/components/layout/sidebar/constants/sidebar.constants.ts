import type { TFunction } from 'i18next';
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
      },
      {
        type: 'link', key: 'students', title: t('sidebar.nav.students'), href: '/students', icon: 'students',
      },
      {
        type: 'link', key: 'circles', title: t('sidebar.nav.circles'), href: '/circles', icon: 'circles',
      },
    ],
  };
}

export function getSettingsNavSection(_t: TFunction): SidebarNavSection {
  return {
    labelKey: 'sidebar.sections.main',
    items: [],
  };
}

export function getRouteGroupKey(_pathname: string): string | null {
  return null;
}

export type { SidebarNavEntry };
