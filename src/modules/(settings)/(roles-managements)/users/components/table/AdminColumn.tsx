import type { Admin } from '@/modules/(settings)/(roles-managements)/users/types/admin.types';
import ActionButton from '../Actions';
import UserInitials from '@/components/shared/customs/UserInitials';
import TableCellValue from '@/components/shared/customs/TableCellValue';
import type { ColumnDef } from '@tanstack/react-table';
import ActiveSwitch from '../ActiveSwitch';
import { WithPermissions } from '@/components/shared/permissions/WithPermissions';

function getRoleName(admin: Admin, isEnglish: boolean) {
  return isEnglish ? admin.roleNameEn : admin.roleNameIt || admin.roleNameEn;
}

export const getColumns = (
  t: (key: string) => string,
  isEnglish: boolean,
): ColumnDef<Admin>[] => [
  {
    accessorKey: 'admin',
    header: t('table.user'),
    cell: ({ row: { original: admin } }) => (
      <UserInitials
        name={admin.fullName}
        imageUrl={admin.profilePicture}
        roleName={getRoleName(admin, isEnglish)}
      />
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: t('table.phoneNumber'),
    cell: ({ row: { original: admin } }) => (
      <TableCellValue value={admin.phoneNumber} className='type-body-xs-semibold' />
    ),
  },
  {
    accessorKey: 'email',
    header: t('table.email'),
    cell: ({ row: { original: admin } }) => (
      <TableCellValue value={admin.email} className='type-body-xs-semibold' />
    ),
  },
  {
    accessorKey: 'status',
    header: t('table.status'),
    cell: ({ row: { original: admin } }) => <ActiveSwitch admin={admin} />,
  },
  {
    accessorKey: 'actions',
    header: t('table.more'),
    cell: ({ row: { original: admin } }) => (
      <WithPermissions permissions={['admins.update', 'admins.delete']} require='some'>
        <ActionButton admin={admin} />
      </WithPermissions>
    ),
  },
];
