import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

import type { NavItemProps } from '../types/sidebar.types';
import { WithPermissions } from '@/components/shared/permissions/WithPermissions';
import SidebarIcon from '../icons/SidebarIcon';

function NavItem({ to, icon, children, end, permissions }: NavItemProps) {
  return (
    <WithPermissions permissions={permissions ?? []}>
      <NavLink
        end={end}
        to={to}
        className={({ isActive }) =>
          cn(
            'type-link-md group relative flex h-11 w-full items-center gap-3  px-3 py-2.5 transition-colors duration-200',
            isActive
              ? 'bg-primary-500 text-background'
              : 'text-primary-900 hover:bg-neutral-50',
          )
        }
      >
        <SidebarIcon name={icon} className='size-5 shrink-0' />
        <span className='min-w-0 flex-1 truncate'>{children}</span>
      </NavLink>
    </WithPermissions>
  );
}

export default NavItem;
