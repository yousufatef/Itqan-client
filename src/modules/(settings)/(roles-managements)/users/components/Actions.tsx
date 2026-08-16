import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Link2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { Admin } from '@/modules/(settings)/(roles-managements)/users/types/admin.types';
import { useSearchParams } from 'react-router-dom';
import { useDeleteAdmin } from '@/modules/(settings)/(roles-managements)/users/hooks/useDeleteAdmin';
import { useState } from 'react';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import { useTranslation } from 'react-i18next';
import { useDirection } from '@/i18n/useDirection';
import { WithPermissions } from '@/components/shared/permissions/WithPermissions';
import {
  ROLES_MANAGEMENT_ACTION_QUERY_KEY,
  ROLES_MANAGEMENT_ACTIONS,
  ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY,
  ROLES_MANAGEMENT_TAB_QUERY_KEY,
  ROLES_MANAGEMENT_TABS,
} from '@/modules/(settings)/(roles-managements)/constants/roles-management.constants';
import { Link } from 'react-router-dom';

const ActionButton = ({ admin }: { admin?: Admin }) => {
  const { t } = useTranslation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deleteAdmin, isLoading } = useDeleteAdmin();
  const [, setSearchParams] = useSearchParams();
  // const { adminData } = useAdmin(admin?.id ?? '');
  const direction = useDirection();
  const isEnglish = direction === 'ltr';
  const adminName = admin?.fullName || admin?.email || '';
  async function handleDelete() {
    await deleteAdmin(admin?.id ?? '');
    setIsDeleteOpen(false);
  }

  const openEditDialog = () => {
    if (!admin?.id) return;

    setSearchParams((currentSearchParams) => {
      const nextSearchParams = new URLSearchParams(currentSearchParams);
      nextSearchParams.set(ROLES_MANAGEMENT_TAB_QUERY_KEY, ROLES_MANAGEMENT_TABS.users);
      nextSearchParams.set(ROLES_MANAGEMENT_ACTION_QUERY_KEY, ROLES_MANAGEMENT_ACTIONS.editUser);
      nextSearchParams.set(ROLES_MANAGEMENT_ENTITY_ID_QUERY_KEY, admin.id);
      return nextSearchParams;
    });
  };

  return (
    <>
      {/* Dropdown */}
      <DropdownMenu dir={direction}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label='Open row actions'
            size='icon-sm'
            variant='ghost'
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-36'
        >
          <DropdownMenuItem>
            <Link2 className='h-4 w-4' aria-hidden='true' />
            <Link
              to={`/settings/users/resend-invite/${admin?.id}`}
              className='w-full'
            >
              {t('admin.buttons.resendLink')}
            </Link>
          </DropdownMenuItem>
          <WithPermissions permissions={['admins.update']}>
            <DropdownMenuItem onClick={openEditDialog}>
              <Pencil className='h-4 w-4' aria-hidden='true' />
              {t('admin.buttons.edit')}
            </DropdownMenuItem>
          </WithPermissions>

          <WithPermissions permissions={['admins.delete']}>
            <DropdownMenuItem
              variant='destructive'
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className='h-4 w-4' aria-hidden='true' />
              {t('admin.buttons.delete')}
            </DropdownMenuItem>
          </WithPermissions>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete DIALOG */}
      <WithPermissions permissions={['admins.delete']}>
        <ConfirmDialog
          open={isDeleteOpen}
          onCancel={() => setIsDeleteOpen(false)}
          title={isEnglish ? 'Delete Admin' : 'حذف الادمن'}
          description={
            isEnglish ? (
              <p className='text-secondary-400'>
                Are you sure you want to delete{' '}
                <span className='text-primary-500 font-semibold'>{adminName}</span> from Admins
                List?
              </p>
            ) : (
              <p className='text-secondary-400'>
                هل انت متأكد من مسح{' '}
                <span className='text-primary-500 font-semibold'>{adminName}</span> من قائمة الادمن
                ؟
              </p>
            )
          }
          confirmText={t('admin.buttons.delete')}
          cancelText={t('admin.buttons.cancel')}
          onConfirm={handleDelete}
          mode='destructive'
          loading={isLoading}
        />
      </WithPermissions>
    </>
  );
};

export default ActionButton;
