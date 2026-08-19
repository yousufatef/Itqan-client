import type { ComponentProps, ReactNode } from 'react';
import type { Sidebar } from '@/components/ui/sidebar';
import type { AppPermissions } from '@/types/auth.types';

export type SidebarSide = ComponentProps<typeof Sidebar>['side'];

export type SubNavItem = {
  title: string;
  href: string;
  permissions?: AppPermissions[];
};

export type MainNavItem = SubNavItem & { icon: string };

export type SidebarNavLink = {
  type: 'link';
  key: string;
  title: string;
  href: string;
  icon: string;
  end?: boolean;
  permissions?: AppPermissions[];
};

export type SidebarNavGroup = {
  type: 'group';
  key: string;
  title: string;
  icon: string;
  routePrefix: string;
  items: SubNavItem[];
};

export type SidebarNavLogout = {
  type: 'logout';
  key: string;
  title: string;
  icon: string;
};

export type SidebarNavEntry = SidebarNavLink | SidebarNavGroup | SidebarNavLogout;

export type SidebarNavSection = {
  labelKey: string;
  items: SidebarNavEntry[];
};

export type CustomSidebarProps = {
  side?: SidebarSide;
};

export type NavItemProps = {
  to: string;
  icon: string;
  children: ReactNode;
  end?: boolean;
  permissions?: AppPermissions[];
};

