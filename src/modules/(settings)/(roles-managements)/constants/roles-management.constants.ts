export const ROLES_MANAGEMENT_TABS = {
  roles: 'roles',
  users: 'users',
  guests: 'guests',
} as const;

export type RolesManagementTab =
  (typeof ROLES_MANAGEMENT_TABS)[keyof typeof ROLES_MANAGEMENT_TABS];

export const ROLES_MANAGEMENT_TAB_QUERY_KEY = 'tab';

export const ROLES_MANAGEMENT_ACTIONS = {
  addRole: 'add-role',
  addUser: 'add-user',
  editRole: 'edit-role',
  editUser: 'edit-user',
} as const;

export const ROLES_MANAGEMENT_ACTION_QUERY_KEY = 'action';
export const ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY = 'id';
