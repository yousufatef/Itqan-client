import { ChevronDown, ChevronUp } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import SidebarIcon from '../icons/SidebarIcon';
import type { ExpandableNavItemProps } from '../types/sidebar.types';
import { WithPermissions } from '@/components/shared/permissions/WithPermissions';

function isChildActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ExpandableNavItem({ title, icon, items, isOpen, onToggle }: ExpandableNavItemProps) {
  const { pathname } = useLocation();
  const hasActiveChild = items.some((item) => isChildActive(pathname, item.href));
  const allItemsPermissions = items.flatMap((item) => item.permissions ?? []);
  const allItemsHasPermissions = items.every((item) => item.permissions !== undefined);

  return (
    <WithPermissions
      permissions={allItemsHasPermissions ? allItemsPermissions : []}
      require='some'
    >
      <div className='flex flex-col gap-1'>
        <button
          type='button'
          onClick={onToggle}
          className={cn(
            'type-link-md relative flex h-12 w-full items-center rounded-r-sm px-3 py-2.5 transition-colors',
            hasActiveChild
              ? 'bg-primary-500 text-background'
              : 'text-primary-900 hover:bg-neutral-50',
          )}
        >
          {hasActiveChild ? (
            <span
              aria-hidden='true'
              className='pointer-events-none absolute inset-y-0 left-0 w-2 rounded-r-sm bg-white'
            />
          ) : null}
          <div className='relative z-10 flex w-full items-center gap-3'>
            <SidebarIcon
              name={icon}
              className={cn('size-5 shrink-0', hasActiveChild ? 'text-background' : 'text-primary-900')}
            />
            <span className='min-w-0 flex-1 truncate text-start'>{title}</span>
            {isOpen ? (
              <ChevronUp
                className={cn('size-4 shrink-0', hasActiveChild ? 'text-white' : 'text-neutral-400')}
                aria-hidden='true'
              />
            ) : (
              <ChevronDown
                className={cn('size-4 shrink-0', hasActiveChild ? 'text-white' : 'text-neutral-400')}
                aria-hidden='true'
              />
            )}
          </div>
        </button>

        <div
          className={cn(
            'grid transition-[grid-template-rows] mr-4  duration-300 ease-out',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className='overflow-hidden'>
            <ul className='flex flex-col gap-0.5 py-1 ml-2 border-l   border-primary-200'>
              {items.map((item) => (
                <WithPermissions
                  permissions={item.permissions ?? []}
                  require={item.permissions && item.permissions.length > 1 ? 'some' : 'all'}
                  key={item.href}
                >
                  <li>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'type-link-md flex h-9 w-full items-center py-2 ps-2 ms-4 transition-colors',
                          isActive
                            ? 'bg-primary-200 rounded-r-sm text-neutral-900 '
                            : 'text-neutral-700 hover:bg-neutral-50',
                        )
                      }
                    >
                      {item.title}
                    </NavLink>
                  </li>
                </WithPermissions>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </WithPermissions>
  );
}

export default ExpandableNavItem;
