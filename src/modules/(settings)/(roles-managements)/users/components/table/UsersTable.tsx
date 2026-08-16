import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMemo } from 'react';
import { getColumns } from './AdminColumn';
import type { Admin } from '@/modules/(settings)/(roles-managements)/users/types/admin.types';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/shared/customs/CustomPagination';
import { useAdminsList } from '../../hooks/useGetAdminsList';
import MainLoader from '@/components/shared/loader/MainLoader';
import ErrorPage from '@/modules/error/ErrorPage';

const UsersTable = () => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const columns = getColumns(t, isEnglish);
  const { clearTableSearchParams, params } = useTableSearchParam();
  const hasFilters = !!params.sort;
  const { admins, isLoading, isFetching, error, totalCount } = useAdminsList();
  const filteredAdmins = useMemo(
    () =>
      admins?.map((admin: Admin, index: number) => ({
        ...admin,
        rowNumber: index + 1,
      })) || [],
    [admins],
  );

  if (isLoading) {
    return <MainLoader />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col justify-start gap-3 md:flex-row md:items-center'>
        <CustomSearchBar
          placeholder={t('admin.searchPlaceholder')}
          searchParamName='searchValue'
          wrapperClassName='md:max-w-sm shadow-[0px_4px_20px_0px_#0D3B2E12]'
        />
        {hasFilters && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='min-h-12 shrink-0'
            onClick={() => clearTableSearchParams()}
          >
            <X />
            {t('admin.buttons.clear')}
          </Button>
        )}
      </div>

      <CustomTable
        columns={columns}
        data={filteredAdmins}
        emptyMessage={t('admin.emptyMessaege')}
        isFetching={isFetching}
      />

      <Pagination totalCount={totalCount} />
    </div>
  );
};

export default UsersTable;
