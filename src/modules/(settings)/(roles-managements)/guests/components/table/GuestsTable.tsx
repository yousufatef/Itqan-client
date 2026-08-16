import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import MainLoader from '@/components/shared/loader/MainLoader';
import LoadingError from '@/components/shared/error/LoadingError';
import useSettingsGuests from '../../hooks/useSettingsGuests';
import { getGuestColumns } from './GuestColumns';

const GuestsTable = () => {
  const { t } = useTranslation();
  const { isLoading, isError, error, data, refetch, isFetching, isRefetching } = useSettingsGuests();

  const columns = useMemo(() => getGuestColumns(t), [t]);

  if (isLoading) return <MainLoader />;

  if (isError) {
    return (
      <LoadingError
        errorMsg={error.message}
        onRefetch={refetch}
        isRefetching={isRefetching}
      />
    );
  }

  const guestsList = data?.result ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className=' flex flex-col gap-6'>
      <div className='flex flex-col justify-start gap-3 md:flex-row md:items-center'>
        <CustomSearchBar
          placeholder={t('rolesManagement.guests.searchPlaceholder')}
          searchParamName='searchValue'
          wrapperClassName='md:max-w-sm shadow-[0px_4px_20px_0px_#0D3B2E12]'
        />
      </div>

      <div className='relative'>
        <CustomTable
          columns={columns}
          data={guestsList}
          emptyMessage={t('rolesManagement.guests.emptyMessage')}
          isFetching={isFetching}
        />
      </div>

      <Pagination totalCount={totalCount} />
    </div>
  );
};

export default GuestsTable;
