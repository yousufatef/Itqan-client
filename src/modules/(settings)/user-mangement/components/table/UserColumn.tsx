import UserInitials from '@/components/shared/customs/UserInitials';
import TableCellValue from '@/components/shared/customs/TableCellValue';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/utils/FormatDate';
import {
  ACCOUNT_AVATAR_CONFIG,
  ACCOUNT_STATUS_CONFIG,
  KYC_STATUS_CONFIG,
} from '../../constants/user.constants';
import type { UserTableRow } from '../../types/user.types';
import { toActiveStatus } from '../../types/user.types';
import UserStatusBadge from '../UserStatusBadge';
import UserActions from './actions/UserActions';

export const getColumns = (
  t: (key: string) => string,
  isEnglish: boolean,
): ColumnDef<UserTableRow>[] => [
  {
    accessorKey: 'user',
    header: t('table.user'),
    cell: ({ row: { original: user } }) =>
      user.fullName?.trim() ? (
        <UserInitials
          name={user.fullName}
          avatarClassName={ACCOUNT_AVATAR_CONFIG[toActiveStatus(user.isActive)]}
        />
      ) : (
        <TableCellValue value={null} />
      ),
  },
  {
    accessorKey: 'phoneNumber',
    header: t('table.mobile'),
    cell: ({ row: { original: user } }) => <TableCellValue value={user.phoneNumber} />,
  },
  {
    accessorKey: 'email',
    header: t('table.email'),
    cell: ({ row: { original: user } }) => <TableCellValue value={user.email} />,
  },
  {
    accessorKey: 'createdOn',
    header: t('table.joiningDate'),
    cell: ({ row: { original: user } }) => (
      <TableCellValue value={user.createdOn ? formatDate(user.createdOn, isEnglish) : null} />
    ),
  },
  {
    accessorKey: 'isActive',
    header: t('table.accountStatus'),
    cell: ({ row: { original: user } }) => (
      <UserStatusBadge config={ACCOUNT_STATUS_CONFIG[toActiveStatus(user.isActive)]} />
    ),
  },
  {
    accessorKey: 'kycStatus',
    header: t('table.kycStatus'),
    cell: ({ row: { original: user } }) => {
      const config = KYC_STATUS_CONFIG[user.kycStatus];
      if (!config) return <TableCellValue value={null} />;
      return <UserStatusBadge config={config} />;
    },
  },
  {
    accessorKey: 'actions',
    header: t('table.more'),
    cell: ({ row: { original: user } }) => <UserActions user={user} />,
  },
];
