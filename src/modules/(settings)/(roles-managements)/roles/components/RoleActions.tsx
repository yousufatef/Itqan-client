import MoreActions from '@/components/shared/customs/MoreActions';
import { Pencil, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import { useDeleteRole } from '@/modules/(settings)/(roles-managements)/roles/hooks/useDeleteRole';
import type { Role } from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';
import {
  ROLES_MANAGEMENT_ACTION_QUERY_KEY,
  ROLES_MANAGEMENT_ACTIONS,
  ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY,
  ROLES_MANAGEMENT_TAB_QUERY_KEY,
  ROLES_MANAGEMENT_TABS,
} from '@/modules/(settings)/(roles-managements)/constants/roles-management.constants';

const RoleActions = ({ role }: { role: Role }) => {
  const {
    mutate: deleteRole,
    isPending: isLoading,
    isDeleteOpen,
    setIsDeleteOpen,
  } = useDeleteRole();
  const { t } = useTranslation();
  function handleDelete() {
    deleteRole(role.id ?? '');
  }

  const [, setSearchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const roleName = isEnglish ? role.nameEn : role.nameAr;

  const openEditDialog = () => {
    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.set(ROLES_MANAGEMENT_TAB_QUERY_KEY, ROLES_MANAGEMENT_TABS.roles);
      nextSearchParams.set(ROLES_MANAGEMENT_ACTION_QUERY_KEY, ROLES_MANAGEMENT_ACTIONS.editRole);
      nextSearchParams.set(ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY, role.id ?? '');
      return nextSearchParams;
    });
  };

  return (
    <>
      {/* Dropdown */}
      <MoreActions
        actions={[
          {
            onClick: openEditDialog,
            text: t('roles.actions.edit'),
            variant: 'default',
            icon: <Pencil className='h-4 w-4' aria-hidden='true' />,
            permissions: ['roles.update'],
          },
          {
            onClick: () => setIsDeleteOpen(true),
            text: t('roles.actions.delete'),
            variant: 'destructive',
            icon: <Trash2 className='h-4 w-4' aria-hidden='true' />,
            permissions: ['roles.delete'],
          },
        ]}
      />

      {/* Delete DIALOG */}
      <ConfirmDialog
        open={isDeleteOpen}
        title={t('roles.actions.deleteTitle')}
        description={
          <div className='flex flex-col'>
            <p className='text-secondary-400'>
              {t('roles.actions.deleteDesc1')}{' '}
              <span className='text-primary-500 font-semibold'>{roleName}</span>{' '}
              {t('roles.actions.deleteDesc3')}
            </p>
            <p className='text-secondary-400'>{t('warns.actionCantBeUndone')}</p>
          </div>
        }
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        confirmText={t('roles.actions.delete')}
        cancelText={t('roles.actions.cancel')}
        loading={isLoading}
        mode='destructive'
      />
    </>
  );
};

export default RoleActions;
