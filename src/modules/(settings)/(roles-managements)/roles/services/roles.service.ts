import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type {
  PermissionApiRes,
  Role,
  RoleApiRes,
  RolePayload,
  RolesListApiRes,
} from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';
import type { ApiResponse, QueryParams } from '@/types/index.t';

export const ROLES_LIST_QUERY_KEY = 'roles-list';
export const ROLE_DETAILS_QUERY_KEY = 'role-details';
export const PERMISSIONS_QUERY_KEY = 'permissions';

export const ROLES_ENDPOINTS = {
  paginated: 'PermissionRoles/paginated',
  all: 'PermissionRoles/all',
  byName: 'PermissionRoles/by-name',
  delete: 'PermissionRoles/id',
} as const;

/** Modules used by Luca Stay roles API. */
export const DEFAULT_ROLE_PERMISSION_NAMES = [
  'workspaces',
  'users',
  'settings',
  'devices',
  'services',
  'apartments',
  'reservations',
  'financials',
  'buildings',
] as const;

type PermissionActions = {
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
};

type NestedPermissions = Record<string, PermissionActions>;

type RawRolePermission = {
  permissionName?: string;
  permissionCode?: string;
  module?: string;
  authorityNames?: string[];
  canRead?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
};

type RawRole = {
  id?: string;
  roleId?: string;
  roleNameEn?: string;
  roleNameIt?: string;
  nameEn?: string;
  nameAr?: string;
  nameIt?: string;
  description?: string;
  descriptionIt?: string;
  isActive?: boolean;
  assignedUsersCount?: number;
  permissionsCount?: number;
  createdBy?: string;
  createdByAdmin?: string | null;
  permissions?: NestedPermissions | RawRolePermission[];
  assignedPermissions?: RawRolePermission[];
};

function capitalizeModuleName(moduleName: string) {
  if (!moduleName) return moduleName;
  return moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
}

function countEnabledPermissions(permissions: PermissionApiRes[]) {
  return permissions.reduce((count, permission) => {
    return (
      count +
      Number(permission.canRead) +
      Number(permission.canCreate) +
      Number(permission.canUpdate) +
      Number(permission.canDelete)
    );
  }, 0);
}

function normalizePermissionFromActions(
  moduleName: string,
  actions: PermissionActions = {},
): PermissionApiRes {
  return {
    id: moduleName,
    permissionCode: moduleName,
    permissionName: capitalizeModuleName(moduleName),
    module: moduleName,
    canRead: Boolean(actions.read),
    canCreate: Boolean(actions.create),
    canUpdate: Boolean(actions.update),
    canDelete: Boolean(actions.delete),
  };
}

function normalizePermission(raw: RawRolePermission, index = 0): PermissionApiRes {
  const permissionName =
    raw.permissionName?.trim() ||
    raw.permissionCode?.trim() ||
    raw.module?.trim() ||
    `permission-${index}`;

  if (raw.authorityNames?.length) {
    const set = new Set(raw.authorityNames.map((item) => item.toLowerCase()));
    return {
      id: permissionName,
      permissionCode: permissionName,
      permissionName: capitalizeModuleName(permissionName),
      module: permissionName,
      canRead: set.has('read') || set.has('view'),
      canCreate: set.has('create'),
      canUpdate: set.has('update') || set.has('edit'),
      canDelete: set.has('delete'),
    };
  }

  return {
    id: permissionName,
    permissionCode: permissionName,
    permissionName: capitalizeModuleName(permissionName),
    module: raw.module?.trim() || permissionName,
    canRead: Boolean(raw.canRead ?? raw.read),
    canCreate: Boolean(raw.canCreate ?? raw.create),
    canUpdate: Boolean(raw.canUpdate ?? raw.update),
    canDelete: Boolean(raw.canDelete ?? raw.delete),
  };
}

function normalizePermissions(
  permissions: NestedPermissions | RawRolePermission[] | undefined,
  assignedPermissions?: RawRolePermission[],
): PermissionApiRes[] {
  if (Array.isArray(permissions)) {
    return permissions.map(normalizePermission);
  }

  if (permissions && typeof permissions === 'object') {
    return Object.entries(permissions).map(([moduleName, actions]) =>
      normalizePermissionFromActions(moduleName, actions),
    );
  }

  if (Array.isArray(assignedPermissions)) {
    return assignedPermissions.map(normalizePermission);
  }

  return [];
}

function normalizeRole(raw: RawRole): Role {
  const permissions = normalizePermissions(raw.permissions, raw.assignedPermissions);

  return {
    id: raw.roleId ?? raw.id ?? '',
    nameEn: raw.roleNameEn ?? raw.nameEn ?? '',
    nameAr: raw.roleNameIt ?? raw.nameIt ?? raw.nameAr ?? '',
    description: raw.description ?? '',
    descriptionIt: raw.descriptionIt ?? '',
    isActive: raw.isActive ?? true,
    assignedUsersCount: raw.assignedUsersCount ?? 0,
    permissionsCount: raw.permissionsCount ?? countEnabledPermissions(permissions),
    createdBy: raw.createdBy ?? raw.createdByAdmin ?? '',
    createdByAdmin: raw.createdByAdmin ?? null,
    assignedPermissions: permissions,
  };
}

function unwrapList<T>(response: unknown): { items: T[]; totalCount: number } {
  if (Array.isArray(response)) {
    return { items: response as T[], totalCount: response.length };
  }

  if (response && typeof response === 'object') {
    const envelope = response as Record<string, unknown>;
    const nested =
      (envelope.result as Record<string, unknown> | T[] | undefined) ??
      (envelope.data as Record<string, unknown> | T[] | undefined);

    if (Array.isArray(nested)) {
      return {
        items: nested,
        totalCount: Number(envelope.totalCount ?? nested.length) || nested.length,
      };
    }

    if (nested && typeof nested === 'object') {
      const nestedResult = (nested.result ?? nested.data) as T[] | undefined;
      if (Array.isArray(nestedResult)) {
        return {
          items: nestedResult,
          totalCount:
            Number(nested.totalCount ?? envelope.totalCount ?? nestedResult.length) ||
            nestedResult.length,
        };
      }
    }
  }

  return { items: [], totalCount: 0 };
}

type RoleByNamePermissionPayload = {
  permissionName: string;
  authorityNames: string[];
};

type RoleByNamePayload = {
  roleNameEn: string;
  roleNameIt: string;
  description: string;
  descriptionIt: string;
  permissions: RoleByNamePermissionPayload[];
  id?: string;
};

function toAuthorityNames(permission: RolePayload['permissions'][number]): string[] {
  const authorityNames: string[] = [];

  if (permission.canRead) authorityNames.push('read');
  if (permission.canCreate) authorityNames.push('create');
  if (permission.canUpdate) authorityNames.push('update');
  if (permission.canDelete) authorityNames.push('delete');

  return authorityNames;
}

export function toRoleApiPayload(role: RolePayload, roleId?: string): RoleByNamePayload {
  const permissions = role.permissions
    .map((permission) => {
      const permissionName = (permission.permissionName || permission.id || '').trim();
      if (!permissionName) return null;

      const authorityNames = toAuthorityNames(permission);
      if (authorityNames.length === 0) return null;

      return { permissionName, authorityNames };
    })
    .filter((permission): permission is RoleByNamePermissionPayload => permission !== null);

  const payload: RoleByNamePayload = {
    roleNameEn: role.nameEn,
    roleNameIt: role.nameAr,
    description: role.description ?? '',
    descriptionIt: role.descriptionIt ?? '',
    permissions,
  };

  if (roleId) {
    payload.id = roleId;
  }

  return payload;
}

export async function getRoles(params: QueryParams): Promise<RolesListApiRes> {
  const pageNumber = Number(params.pageNumber ?? 1);
  const pageSize = Number(params.pageSize ?? 10);
  const searchTerm = String(params.searchValue ?? params.searchTerm ?? '');

  const response = await apiRequest(
    `${ROLES_ENDPOINTS.paginated}?${generateQueryParams({
      PageNumber: pageNumber,
      PageSize: pageSize,
      SearchTerm: searchTerm || undefined,
    })}`,
    { method: 'GET' },
  );

  const { items, totalCount } = unwrapList<RawRole>(response);

  return {
    result: items.map(normalizeRole),
    totalCount,
    pageNumber,
    pageSize,
    message: null,
    errors: null,
    statusCode: 200,
  };
}

export async function getAllRoles(): Promise<Role[]> {
  const response = await apiRequest(ROLES_ENDPOINTS.all, { method: 'GET' });
  const { items } = unwrapList<RawRole>(response);
  return items.map(normalizeRole);
}

export const getRoleDetails = async (roleId: string): Promise<ApiResponse<RoleApiRes>> => {
  // Prefer paginated list (known shape); fall back to /all.
  const listResponse = await getRoles({ pageNumber: 1, pageSize: 200, searchValue: '' });
  let role = listResponse.result.find((item) => item.id === roleId);

  if (!role) {
    const roles = await getAllRoles();
    role = roles.find((item) => item.id === roleId);
  }

  if (!role) {
    throw new Error('Role not found');
  }

  return {
    isSuccess: true,
    result: {
      id: role.id,
      nameAr: role.nameAr,
      nameEn: role.nameEn,
      description: role.description,
      descriptionIt: role.descriptionIt,
      isActive: role.isActive,
      permissions: role.assignedPermissions,
    },
    message: null,
    errors: null,
    statusCode: 200,
  };
};

export const getAllPermissions = async (): Promise<ApiResponse<PermissionApiRes[]>> => {
  const roles = await getAllRoles().catch(() => [] as Role[]);
  const byName = new Map<string, PermissionApiRes>();

  DEFAULT_ROLE_PERMISSION_NAMES.forEach((moduleName) => {
    byName.set(moduleName, normalizePermissionFromActions(moduleName));
  });

  roles.forEach((role) => {
    role.assignedPermissions.forEach((permission) => {
      if (!byName.has(permission.module)) {
        byName.set(permission.module, {
          ...permission,
          canRead: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
        });
      }
    });
  });

  return {
    isSuccess: true,
    result: Array.from(byName.values()),
    message: null,
    errors: null,
    statusCode: 200,
  };
};

export const addRoleApi = async (role: RolePayload): Promise<ApiResponse<Role>> => {
  const response = await apiRequest(ROLES_ENDPOINTS.byName, {
    method: 'POST',
    body: toRoleApiPayload(role),
  });

  return response as ApiResponse<Role>;
};

export const updateRoleApi = async (
  roleId: string,
  role: RolePayload,
): Promise<ApiResponse<Role>> => {
  const response = await apiRequest(ROLES_ENDPOINTS.byName, {
    method: 'PUT',
    body: toRoleApiPayload(role, roleId),
  });

  return response as ApiResponse<Role>;
};

export const deleteRoleApi = async (roleId: string) => {
  return apiRequest(`${ROLES_ENDPOINTS.delete}?${generateQueryParams({ id: roleId })}`, {
    method: 'DELETE',
  });
};
