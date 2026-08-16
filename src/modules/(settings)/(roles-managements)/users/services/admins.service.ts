import type { NewAdmin } from '@/modules/(settings)/(roles-managements)/users/types/admin.types';
import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import { getAllRoles } from '@/modules/(settings)/(roles-managements)/roles/services/roles.service';
import type { AssignedRole } from '../types/admin.types';

export const ADMINS_ENDPOINTS = {
  allUsers: 'Users/Users',
  allAdmins: 'Users/all-admins',
  create: 'Users/create-admin',
  edit: 'Users/edit-admin',
  delete: 'Users/adminId',
  suspend: 'Users/suspend-admin',
} as const;

type RawAdmin = {
  id?: string;
  adminId?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  userName?: string;
  roleId?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  createdOn?: string;
  profilePicture?: string;
  roleNameEn?: string;
  roleNameAr?: string;
  roleNameIt?: string;
};

function normalizeAdmin(raw: RawAdmin) {
  const fullName =
    raw.fullName?.trim() ||
    [raw.firstName, raw.lastName].filter(Boolean).join(' ').trim() ||
    '';

  const isSuspended = raw.isSuspended ?? false;

  return {
    id: raw.id ?? raw.adminId ?? '',
    fullName,
    firstName: raw.firstName,
    lastName: raw.lastName,
    phoneNumber: raw.phoneNumber ?? '',
    email: raw.email ?? '',
    userName: raw.userName ?? raw.email ?? '',
    roleId: raw.roleId,
    isSuspended,
    isActive: raw.isActive ?? !isSuspended,
    createdOn: raw.createdOn,
    profilePicture: raw.profilePicture,
    roleNameEn: raw.roleNameEn,
    roleNameIt: raw.roleNameIt ?? raw.roleNameAr,
  };
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
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

export async function getAdminsListApi(
  pageNumber = 1,
  pageSize = 50,
  searchTerm = '',
  _sort = 0,
  _status = '',
) {
  const response = await apiRequest(
    `${ADMINS_ENDPOINTS.allAdmins}?${generateQueryParams({
      SearchTerm: searchTerm || undefined,
      PageSize: pageSize,
      PageNumber: pageNumber,
    })}`,
    { method: 'GET' },
  );

  const { items, totalCount } = unwrapList<RawAdmin>(response);

  return {
    data: {
      result: items.map(normalizeAdmin),
      totalCount,
      pageNumber,
      pageSize,
    },
    result: items.map(normalizeAdmin),
    totalCount,
    message: null,
    errors: null,
    statusCode: 200,
  };
}

export async function getAllUsersApi() {
  return apiRequest(ADMINS_ENDPOINTS.allUsers, { method: 'GET' });
}

export async function getAdminApi(id: string) {
  const response = await getAdminsListApi(1, 200, '');
  const admin = response.data.result.find((item) => item.id === id);

  if (!admin) {
    throw new Error('Admin not found');
  }

  return {
    data: admin,
    result: admin,
    message: null,
    errors: null,
    statusCode: 200,
  };
}

export async function createAdminApi(data: NewAdmin & { password?: string; confirmPassword?: string }) {
  const splitName = data.fullName ? splitFullName(data.fullName) : { firstName: '', lastName: '' };
  const firstName = data.firstName ?? splitName.firstName;
  const lastName = data.lastName ?? splitName.lastName;
  const formData = new FormData();

  formData.append('FirstName', firstName);
  formData.append('LastName', lastName);
  formData.append('PhoneNumber', data.phoneNumber);
  formData.append('Email', data.email);
  formData.append('Password', data.password ?? '');
  formData.append('ConfirmPassword', data.confirmPassword ?? data.password ?? '');
  formData.append('RoleId', data.roleId);

  return apiRequest(ADMINS_ENDPOINTS.create, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteAdminApi(id: string) {
  return apiRequest(`${ADMINS_ENDPOINTS.delete}?${generateQueryParams({ adminId: id })}`, {
    method: 'DELETE',
  });
}

export async function updateAdminApi(id: string, data: NewAdmin) {
  const splitName = data.fullName ? splitFullName(data.fullName) : { firstName: '', lastName: '' };
  const firstName = data.firstName ?? splitName.firstName;
  const lastName = data.lastName ?? splitName.lastName;
  const formData = new FormData();

  formData.append('Id', id);
  formData.append('FirstName', firstName);
  formData.append('LastName', lastName);
  formData.append('PhoneNumber', data.phoneNumber);
  formData.append('Email', data.email);
  formData.append('RoleId', data.roleId);

  return apiRequest(ADMINS_ENDPOINTS.edit, {
    method: 'POST',
    body: formData,
  });
}

export async function getAdminsRolesListApi(
  pageNumber = 1,
  pageSize = 50,
  searchValue = '',
  sort = 0,
  status = '',
) {
  // Roles list for admin forms uses PermissionRoles/all; keep signature for callers.
  void pageNumber;
  void pageSize;
  void searchValue;
  void sort;
  void status;

  const roles = await getAllRoles();

  return {
    isSuccess: true,
    data: {
      totalCount: roles.length,
      pageSize: roles.length,
      pageNumber: 1,
      result: roles,
    },
    message: '',
    errors: [],
    statusCode: 200,
  };
}

export async function getAdminRolesPermissionsListApi() {
  const roles = await getAllRoles();

  const mapped: AssignedRole[] = roles.map((role) => ({
    id: role.id,
    nameEn: role.nameEn,
    nameAr: role.nameAr,
    isActive: role.isActive,
    assignedPermissions: role.assignedPermissions.map((permission) => ({
      permissionId: permission.id,
      permissionCode: permission.permissionCode,
      permissionNameAr: permission.permissionName,
      permissionNameEn: permission.permissionName,
      permissionName: permission.permissionName,
      moduleEn: permission.module,
      moduleAr: permission.module,
      canRead: permission.canRead,
      canCreate: permission.canCreate,
      canUpdate: permission.canUpdate,
      canDelete: permission.canDelete,
    })),
  }));

  return {
    data: mapped,
    result: mapped,
    message: null,
    errors: null,
    statusCode: 200,
  };
}

export async function changeAdminStatusApi(id: string, _isActive: boolean) {
  void _isActive;
  return apiRequest(`${ADMINS_ENDPOINTS.suspend}/${id}`, {
    method: 'PUT',
  });
}
