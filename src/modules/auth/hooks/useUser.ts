import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useMemo } from 'react';

import { REFRESH_TOKEN, TOKEN } from '@/constants';
import { isSuperAdminRole } from '@/modules/auth/constants/permissions.constants';
import { USER_DETAILS_QUERY_KEY } from '@/modules/auth/constants/queryKeys';
import { getUserDetails } from '@/modules/auth/service/auth.service';
import type { UserApiResponse } from '@/modules/auth/types/auth.types';
import type { AppPermissions } from '@/types/auth.types';

const ACTIONS = ['create', 'read', 'update', 'delete'] as const;

type PermissionAction = (typeof ACTIONS)[number];

const toPermissionCode = (moduleKey: string, action: PermissionAction): AppPermissions => {
  return `${moduleKey.toLowerCase()}.${action}` as AppPermissions;
};

const flattenRolePermissions = (
  permissions: Record<string, Record<PermissionAction, boolean>> | undefined,
): AppPermissions[] => {
  if (!permissions) return [];

  const result: AppPermissions[] = [];
  Object.entries(permissions).forEach(([moduleKey, actions]) => {
    if (typeof actions !== 'object' || actions === null) return;

    ACTIONS.forEach((action) => {
      if (actions[action]) {
        result.push(toPermissionCode(moduleKey, action));
      }
    });
  });

  return result;
};

type UserResult = UserApiResponse['result'];

function extractUserPermissions(userResult: UserResult): AppPermissions[] {
  const resultPermission = (userResult as { permission?: AppPermissions[] }).permission;
  if (Array.isArray(resultPermission) && resultPermission.length > 0) {
    return resultPermission;
  }

  const userPermission = (userResult.user as { permission?: AppPermissions[] }).permission;
  if (Array.isArray(userPermission) && userPermission.length > 0) {
    return userPermission;
  }

  const rolePermissions = userResult.role?.permissions;
  if (!rolePermissions) return [];

  if (Array.isArray(rolePermissions)) {
    return rolePermissions.filter(
      (permission): permission is AppPermissions =>
        typeof permission === 'string' && permission.includes('.'),
    );
  }

  return flattenRolePermissions(
    rolePermissions as Record<string, Record<PermissionAction, boolean>>,
  );
}

export function useUser() {
  const token = Cookies.get(TOKEN);
  const refreshToken = Cookies.get(REFRESH_TOKEN);

  const isAuthenticated = !!token || !!refreshToken;

  const { data, isLoading, isError } = useQuery<UserApiResponse['result'], Error>({
    queryKey: [USER_DETAILS_QUERY_KEY],
    queryFn: getUserDetails,
    enabled: isAuthenticated,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const userResult = data;
  const isSuperAdmin = isSuperAdminRole(userResult?.role);
  const user = userResult
    ? {
      ...userResult.user,
      roleName: userResult.role?.nameEn ?? '',
      isSuperAdmin,
      permission: extractUserPermissions(userResult),
    }
    : undefined;

  const permissionSet: Set<AppPermissions> = useMemo(
    () => new Set(user?.permission || []),
    [user?.permission],
  );

  return {
    isError,
    isLoading,
    user,
    isVerified: true,
    isAuthenticated,
    isSuperAdmin,
    permissionSet,
  };
}
