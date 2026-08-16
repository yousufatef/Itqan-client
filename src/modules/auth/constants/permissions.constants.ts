export const SUPER_ADMIN_ROLE_NAME_EN = 'Super Admin';
export const SUPER_ADMIN_ROLE_NAME_IT = 'Super amministratore';

type RoleNameSource = {
  nameEn?: string | null;
  nameIt?: string | null;
};

export function isSuperAdminRole(role?: RoleNameSource | null): boolean {
  if (!role) return false;

  const nameEn = role.nameEn?.trim().toLowerCase();
  const nameIt = role.nameIt?.trim().toLowerCase();

  return (
    nameEn === SUPER_ADMIN_ROLE_NAME_EN.toLowerCase() ||
    nameIt === SUPER_ADMIN_ROLE_NAME_IT.toLowerCase()
  );
}
