import type { ColumnDef } from '@tanstack/react-table';
import UserInitials from '@/components/shared/customs/UserInitials';
import TableCellValue from '@/components/shared/customs/TableCellValue';
import type { SettingsGuestApi } from '../../services/guests.service';

function getGuestFullName(guest: SettingsGuestApi) {
  return [guest.firstName, guest.lastName].filter(Boolean).join(' ').trim();
}

function getGuestPhone(guest: SettingsGuestApi) {
  return guest.phone?.trim() || guest.phoneNumber?.trim() || guest.mobile?.trim() || '';
}

export const getGuestColumns = (
  t: (key: string) => string,
): ColumnDef<SettingsGuestApi>[] => [
  {
    accessorKey: 'name',
    header: t('rolesManagement.guests.table.name'),
    cell: ({ row: { original: guest } }) => {
      const fullName = getGuestFullName(guest);

      return fullName ? (
        <UserInitials
          name={fullName}
          avatarClassName='bg-primary-500 text-neutral-900'
          textClassName='type-body-sm-semibold text-neutral-900'
        />
      ) : (
        <TableCellValue value={null} />
      );
    },
  },
  {
    accessorKey: 'phone',
    header: t('rolesManagement.guests.table.phone'),
    cell: ({ row: { original: guest } }) => (
      <TableCellValue
        value={getGuestPhone(guest) || null}
        className='type-body-sm text-neutral-900'
      />
    ),
  },
  {
    accessorKey: 'email',
    header: t('rolesManagement.guests.table.email'),
    cell: ({ row: { original: guest } }) => (
      <TableCellValue
        value={guest.email}
        className='type-body-sm text-neutral-900'
      />
    ),
  },
];
