import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useMemo } from 'react';

import { REFRESH_TOKEN, TOKEN } from '@/constants';
import {
  getPermissionsForRole,
  isSuperAdminRole,
  normalizeRoleName,
} from '@/modules/auth/constants/permissions.constants';
import { USER_DETAILS_QUERY_KEY } from '@/modules/auth/constants/queryKeys';
import { getUserDetails } from '@/modules/auth/service/auth.service';
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

type UserResult = Record<string, unknown>;
type RoleResult = {
  name?: string | null;
  nameEn?: string | null;
  nameIt?: string | null;
  permissions?: unknown;
};

type NormalizedUser = Record<string, unknown> & {
  id?: string;
  username?: string;
  userName?: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  roleName: string;
  isSuperAdmin: boolean;
  permission: AppPermissions[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function getId(value: unknown): string | undefined {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
}

function getUserPayload(userResult: UserResult): Record<string, unknown> {
  return isRecord(userResult.user) ? userResult.user : userResult;
}

function getRolePayload(
  userResult: UserResult,
  userPayload: Record<string, unknown>,
): RoleResult | undefined {
  if (isRecord(userResult.role)) return userResult.role as RoleResult;
  if (isRecord(userPayload.role)) return userPayload.role as RoleResult;

  return undefined;
}

function getRoleName(
  userResult: UserResult,
  userPayload: Record<string, unknown>,
  role?: RoleResult,
): string {
  return (
    getString(role?.nameEn) ??
    getString(role?.name) ??
    getString(userResult.roleName) ??
    getString(userResult.userType) ??
    getString(userPayload.userType) ??
    getString(userPayload.role) ??
    ''
  );
}

function extractUserPermissions(userResult: UserResult): AppPermissions[] {
  const userPayload = getUserPayload(userResult);
  const role = getRolePayload(userResult, userPayload);
  const roleName = getRoleName(userResult, userPayload, role);

  const resultPermission = userResult.permission;
  if (Array.isArray(resultPermission) && resultPermission.length > 0) {
    return resultPermission.filter(
      (permission): permission is AppPermissions => typeof permission === 'string',
    );
  }

  const userPermission = userPayload.permission;
  if (Array.isArray(userPermission) && userPermission.length > 0) {
    return userPermission.filter(
      (permission): permission is AppPermissions => typeof permission === 'string',
    );
  }

  const rolePermissions = role?.permissions;
  if (!rolePermissions) return getPermissionsForRole(roleName);

  if (Array.isArray(rolePermissions)) {
    const permissions = rolePermissions.filter(
      (permission): permission is AppPermissions =>
        typeof permission === 'string' && permission.includes('.'),
    );

    return permissions.length > 0 ? permissions : getPermissionsForRole(roleName);
  }

  const permissions = flattenRolePermissions(
    rolePermissions as Record<string, Record<PermissionAction, boolean>>,
  );

  return permissions.length > 0 ? permissions : getPermissionsForRole(roleName);
}

export function useUser() {
  const token = Cookies.get(TOKEN);
  const refreshToken = Cookies.get(REFRESH_TOKEN);

  const isAuthenticated = !!token || !!refreshToken;

  const { data, isLoading, isError } = useQuery<UserResult, Error>({
    queryKey: [USER_DETAILS_QUERY_KEY],
    queryFn: () => getUserDetails<UserResult>(),
    enabled: isAuthenticated,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const userResult = data;
  const userPayload = userResult ? getUserPayload(userResult) : undefined;
  const role = userResult && userPayload ? getRolePayload(userResult, userPayload) : undefined;
  const roleName = userResult && userPayload ? getRoleName(userResult, userPayload, role) : '';
  const isSuperAdmin =
    isSuperAdminRole(role) || ['super admin', 'superadmin'].includes(normalizeRoleName(roleName));
  const user = useMemo(() => userResult
    ? ({
        ...userPayload,
        id: getId(userPayload?.id) ?? getId(userResult.id),
        username: getString(userPayload?.username),
        userName: getString(userPayload?.userName),
        fullName:
          getString(userPayload?.fullName) ??
          getString(userPayload?.username) ??
          getString(userPayload?.userName) ??
          '',
        email: getString(userPayload?.email),
        phoneNumber: getString(userPayload?.phoneNumber),
        profilePicture:
          getString(userPayload?.profilePicture) ?? getString(userPayload?.profileImage),
        roleName,
        isSuperAdmin,
        permission: extractUserPermissions(userResult),
      } satisfies NormalizedUser)
    : undefined, [userResult, userPayload, roleName, isSuperAdmin]);

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
