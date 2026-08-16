import { useUser } from '@/modules/auth/hooks/useUser';
import type { AppPermissions } from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';

export function usePermissions() {
  const { permissionSet, isSuperAdmin, isLoading, isError } = useUser();

  return {
    isError,
    isLoading,
    isSuperAdmin,
    hasPermission: (p: AppPermissions) => isSuperAdmin || permissionSet.has(p),
    hasAllPermissions: (p: AppPermissions[]) =>
      isSuperAdmin || p.every((permission) => permissionSet.has(permission)),
    hasSomePermissions: (p: AppPermissions[]) =>
      isSuperAdmin || p.some((permission) => permissionSet.has(permission)),
  };
}
