import type { ListApiResponse } from '@/types/index.t';

export type AppPermissions =
  | 'privacy.read'
  | 'privacy.create'
  | 'privacy.update'
  | 'privacy.delete'
  | 'suspension-reasons.read'
  | 'suspension-reasons.create'
  | 'suspension-reasons.update'
  | 'suspension-reasons.delete'
  | 'blogs.create'
  | 'blogs.read'
  | 'blogs.update'
  | 'blogs.delete'
  | 'blogs.publish'
  | 'faqs.create'
  | 'faqs.read'
  | 'faqs.update'
  | 'faqs.delete'
  | 'admins.create'
  | 'admins.read'
  | 'admins.update'
  | 'admins.delete'
  | 'roles.create'
  | 'roles.read'
  | 'roles.update'
  | 'roles.delete'
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  | 'transactions.create'
  | 'transactions.read'
  | 'transactions.update'
  | 'transactions.delete'
  | 'contactus.read'
  | 'contactus.create'
  | 'contactus.update'
  | 'contactus.delete'
  | 'about.read'
  | 'about.create'
  | 'about.update'
  | 'about.delete';

export type RolePermissionAuthority = 'create' | 'read' | 'update' | 'delete';

export type Role = {
  id: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  descriptionIt?: string;
  isActive: boolean;
  assignedUsersCount: number;
  permissionsCount: number;
  createdBy: string;
  createdByAdmin: string | null;
  assignedPermissions: PermissionApiRes[];
};

export type PermissionFormValue = {
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export type RoleDetailsApiRes = {
  id: string;
  nameAr: string;
  nameEn: string;
  permissions: AppPermissions[];
};

export type RolesListApiRes = ListApiResponse<Role[]>;

export type PermissionApiRes = {
  id: string;
  permissionCode: string;
  permissionName: string;
  module: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export type RolePayload = {
  nameAr: string;
  nameEn: string;
  description?: string;
  descriptionIt?: string;
  permissions: {
    id?: string;
    permissionName?: string;
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  }[];
};

export type RoleApiRes = {
  id: string;
  nameAr: string;
  nameEn: string;
  description?: string;
  descriptionIt?: string;
  isActive: boolean;
  permissions: PermissionApiRes[];
};
