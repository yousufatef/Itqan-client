import { usePermissions } from '@/modules/(settings)/(roles-managements)/roles/hooks/usePermissions';
import type { AppPermissions } from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';
import type { ReactNode } from 'react';

type WithPermissionsProps = {
  permissions: AppPermissions[];
  require?: 'all' | 'some';
  children: ReactNode;
  fallback?: ReactNode;
};

export const WithPermissions = ({
  permissions,
  require = 'all',
  children,
  fallback = null,
}: WithPermissionsProps) => {
  const { hasAllPermissions, hasSomePermissions, isLoading, isError } = usePermissions();

  if (isLoading || isError) return null;

  const hasPermissions = permissions.length > 0;
  if (!hasPermissions) return <>{children}</>;

  const hasAccess =
    require === 'all' ? hasAllPermissions(permissions) : hasSomePermissions(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
