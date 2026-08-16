import type { TFunction } from 'i18next';
import type { SidebarNavEntry, SidebarNavSection } from '../types/sidebar.types';

export function getMainNavSection(t: TFunction): SidebarNavSection {
  return {
    labelKey: 'sidebar.sections.main',
    items: [
      {
        type: 'link',
        key: 'dashboard',
        title: t('sidebar.nav.dashboard'),
        href: '/',
        icon: 'dashboard',
        end: true,
      },
      {
        type: 'group',
        key: 'reservations',
        title: t('sidebar.nav.reservations'),
        icon: 'reservations',
        routePrefix: '/reservations',
        items: [
          { title: t('sidebar.reservations.apartments'), href: '/reservations/apartments' },
          { title: t('sidebar.reservations.offices'), href: '/reservations/offices' },
          { title: t('sidebar.reservations.settings'), href: '/reservations/settings' },
        ],
      },
      {
        type: 'group',
        key: 'services',
        title: t('sidebar.nav.services'),
        icon: 'services',
        routePrefix: '/services',
        items: [
          { title: t('sidebar.services.service'), href: '/services/service' },
          { title: t('sidebar.services.serviceRequest'), href: '/services/service-request' },
          { title: t('sidebar.services.packages'), href: '/services/packages' },
          { title: t('sidebar.services.items'), href: '/services/items' },
        ],
      },
      {
        type: 'group',
        key: 'properties',
        title: t('sidebar.nav.properties'),
        icon: 'buildings',
        routePrefix: '/properties',
        items: [
          { title: t('sidebar.properties.buildings'), href: '/properties/buildings' },
          { title: t('sidebar.properties.apartments'), href: '/properties/apartments' },
          { title: t('sidebar.properties.offices'), href: '/properties/offices' },
          { title: t('sidebar.properties.amenities'), href: '/properties/amenities' },
        ],
      },
      {
        type: 'group',
        key: 'financial',
        title: t('sidebar.nav.financial'),
        icon: 'financial',
        routePrefix: '/financial',
        items: [
          { title: t('sidebar.financial.invoices'), href: '/financial/invoices' },
          { title: t('sidebar.financial.taxes'), href: '/financial/taxes' },
          { title: t('sidebar.financial.promoCode'), href: '/financial/promo-code' },
        ],
      },
      {
        type: 'link',
        key: 'devices',
        title: t('sidebar.nav.devices'),
        href: '/devices',
        icon: 'devices',
      },
    ],
  };
}

export function getSettingsNavSection(t: TFunction): SidebarNavSection {
  return {
    labelKey: 'sidebar.sections.settings',
    items: [
      {
        type: 'group',
        key: 'settings',
        title: t('sidebar.nav.settings'),
        icon: 'settings',
        routePrefix: '/settings',
        items: [
          {
            title: t('sidebar.settings.rolesManagement'),
            href: '/settings/roles',
          },
          // { title: t('sidebar.settings.cities'), href: '/settings/cities' },
          { title: t('sidebar.settings.smartGuide'), href: '/settings/smart-guide' },
        ],
      },
      {
        type: 'logout',
        key: 'logout',
        title: t('sidebar.userMenu.logOut'),
        icon: 'logout',
      },
    ],
  };
}

export function getRouteGroupKey(pathname: string): string | null {
  if (pathname.startsWith('/reservations')) return 'reservations';
  if (pathname.startsWith('/services')) return 'services';
  if (pathname.startsWith('/properties')) return 'properties';
  if (pathname.startsWith('/financial')) return 'financial';
  if (pathname.startsWith('/settings')) return 'settings';
  return null;
}

export type { SidebarNavEntry };
