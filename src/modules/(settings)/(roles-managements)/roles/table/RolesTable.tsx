import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import type { Role } from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';
import type { ColumnDef } from '@tanstack/react-table';
import RoleActions from '../components/RoleActions';
import { useTranslation } from 'react-i18next';
import useRoles from '@/modules/(settings)/(roles-managements)/roles/hooks/useRoles';
import MainLoader from '@/components/shared/loader/MainLoader';
import LoadingError from '@/components/shared/error/LoadingError';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableCellValue from '@/components/shared/customs/TableCellValue';

const RolesTable = () => {
  const { t } = useTranslation();
  const isEnglish = useTranslation().i18n.language.startsWith('en');

  const columns: ColumnDef<Role>[] = [
    {
      id: 'roleName',
      accessorKey: isEnglish ? 'nameEn' : 'nameAr',
      header: t('roles.table.roleName'),
      cell: ({ row: { original: role } }) => (
        <TableCellValue
          value={isEnglish ? role.nameEn : role.nameAr || role.nameEn}
          className='type-body-sm-semibold text-neutral-900'
        />
      ),
    },
    {
      id: 'users',
      accessorKey: 'assignedUsersCount',
      header: t('roles.table.users'),
      cell: ({ row: { original: role } }) => (
        <TableCellValue value={String(role.assignedUsersCount ?? 0)} />
      ),
    },
    {
      id: 'permissionsNumber',
      accessorKey: 'permissionsCount',
      header: t('roles.table.permissionsNumber'),
      cell: ({ row: { original: role } }) => (
        <TableCellValue value={String(role.permissionsCount ?? 0)} />
      ),
    },
    {
      id: 'createdBy',
      accessorKey: 'createdBy',
      header: t('roles.table.createdBy'),
      cell: ({ row: { original: role } }) => (
        <TableCellValue
          value={role.createdByAdmin || role.createdBy || null}
          className='type-body-sm text-neutral-700'
        />
      ),
    },
    {
      id: 'more',
      header: t('table.more'),
      cell: ({ row }) => <RoleActions role={row.original} />,
    },
  ];

  const { isLoading, isError, error, data, refetch, isFetching, isRefetching } = useRoles();

  if (isLoading) return <MainLoader />;

  if (isError)
    return (
      <LoadingError
        errorMsg={error.message}
        onRefetch={refetch}
        isRefetching={isRefetching}
      />
    );

  const rolesList = data?.result || [];
  const totalCount = data?.totalCount || 0;

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col justify-start gap-3 md:flex-row md:items-center'>
        <CustomSearchBar
          placeholder={t('roles.table.searchPlaceholder')}
          searchParamName='searchValue'
          wrapperClassName='md:max-w-sm shadow-[0px_4px_20px_0px_#0D3B2E12]'
        />
      </div>

      <div className='relative'>
        <CustomTable
          columns={columns}
          data={rolesList}
          emptyMessage={t('roles.table.emptyMessage')}
          isFetching={isFetching}
        />
      </div>

      <Pagination totalCount={totalCount} />
    </div>
  );
};

export default RolesTable;
