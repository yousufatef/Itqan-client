import type { AppPermissions } from '@/types/auth.types';

export const SUPER_ADMIN_ROLE_NAME_EN = 'Super Admin';
export const SUPER_ADMIN_ROLE_NAME_IT = 'Super amministratore';

type RoleNameSource = {
  nameEn?: string | null;
  nameIt?: string | null;
  name?: string | null;
};

export const APP_PERMISSIONS = {
  users: 'users.read',
  students: 'students.read',
  circles: 'circles.read',
  financial: 'financial.read',
  settings: 'settings.read',
} as const satisfies Record<string, AppPermissions>;

export const ALL_APP_PERMISSIONS = Object.values(APP_PERMISSIONS);

export function normalizeRoleName(role?: string | null): string {
  return role?.trim().toLowerCase().replace(/[_-]+/g, ' ') ?? '';
}

export function isSuperAdminRole(role?: RoleNameSource | null): boolean {
  if (!role) return false;

  const nameEn = normalizeRoleName(role.nameEn);
  const nameIt = normalizeRoleName(role.nameIt);
  const name = normalizeRoleName(role.name);

  return (
    nameEn === normalizeRoleName(SUPER_ADMIN_ROLE_NAME_EN) ||
    nameIt === normalizeRoleName(SUPER_ADMIN_ROLE_NAME_IT) ||
    name === normalizeRoleName(SUPER_ADMIN_ROLE_NAME_EN) ||
    nameEn === 'superadmin' ||
    name === 'superadmin'
  );
}

export function getPermissionsForRole(role?: string | null): AppPermissions[] {
  const normalizedRole = normalizeRoleName(role);

  if (['super admin', 'superadmin', 'admin'].includes(normalizedRole)) {
    return ALL_APP_PERMISSIONS;
  }

  if (normalizedRole === 'teacher') {
    return [APP_PERMISSIONS.circles, APP_PERMISSIONS.settings];
  }

  return [];
}

export function canAccessPath(pathname: string, permissionSet: Set<AppPermissions>): boolean {
  const requiredPermission =
    pathname === '/' || pathname.startsWith('/users')
      ? APP_PERMISSIONS.users
      : pathname.startsWith('/students')
        ? APP_PERMISSIONS.students
        : pathname.startsWith('/circles')
          ? APP_PERMISSIONS.circles
          : pathname.startsWith('/financial')
            ? APP_PERMISSIONS.financial
            : pathname.startsWith('/settings')
              ? APP_PERMISSIONS.settings
              : undefined;

  if (!requiredPermission) return true;
  return permissionSet.has(requiredPermission);
}

export function getDefaultPathForPermissions(permissionSet: Set<AppPermissions>): string {
  if (permissionSet.has(APP_PERMISSIONS.users)) return '/';
  if (permissionSet.has(APP_PERMISSIONS.circles)) return '/circles';
  if (permissionSet.has(APP_PERMISSIONS.settings)) return '/settings';

  return '/login';
}
