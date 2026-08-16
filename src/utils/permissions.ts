import type {
  PermissionApiRes,
  PermissionFormValue,
} from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';

/** Group a flat permissions array by module name. */
export function groupPermissionsByModule(permissions: PermissionApiRes[]) {
  return permissions.reduce<Record<string, PermissionApiRes[]>>((acc, perm) => {
    (acc[perm.module] ??= []).push(perm);
    return acc;
  }, {});
}

/** Build default form values from the API array. */
export function buildDefaultPermissions(
  permissions: PermissionApiRes[],
): Record<string, PermissionFormValue> {
  return permissions.reduce<Record<string, PermissionFormValue>>((acc, perm) => {
    acc[perm.id] = {
      canRead: perm.canRead || false,
      canCreate: perm.canCreate || false,
      canUpdate: perm.canUpdate || false,
      canDelete: perm.canDelete || false,
    };
    return acc;
  }, {});
}
