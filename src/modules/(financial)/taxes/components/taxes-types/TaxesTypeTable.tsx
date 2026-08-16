import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MainLoader from '@/components/shared/loader/MainLoader';
import LoadingError from '@/components/shared/error/LoadingError';

import TaxesTypeActions from './TaxesTypeActions';
import useAllTaxestype from '../../hooks/useAllTaxestype';
import type { TaxType } from '../../types/taxes-types.type';

export default function TaxesTypeTable() {
  const { t } = useTranslation();

  const columns: ColumnDef<TaxType>[] = [
    { header: t('taxesType.table.nameEn'), accessorKey: 'nameEn' },
    { header: t('taxesType.table.nameIt'), accessorKey: 'nameIt' },

    {
      header: t('taxes.table.actions'),
      cell: ({ row: { original: taxType } }) => <TaxesTypeActions taxType={taxType} />,
    },
  ];

  const { data, isLoading, isError, error, isFetching } = useAllTaxestype();

  if (isLoading) return <MainLoader />;
  if (isError) return <LoadingError errorMsg={error.message} />;

  const taxesType = data?.result?.result ?? [];

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <CustomSearchBar
          placeholder={t('taxesType.searchPlaceholder')}
          wrapperClassName='max-w-[400px]'
          searchParamName='searchValue'
        />

        <Button
          size={'default'}
          variant={'outline'}
          className='flex items-center gap-1'
        >
          <Upload className='text-primary size-5.5' />
          {t('buildings.export', 'Export')}
        </Button>
      </div>
      <CustomTable
        data={taxesType ?? []}
        columns={columns}
        isFetching={isFetching}
      />
      <div className='flex items-center justify-between'>
        <TableStatistics totalCount={data?.result?.totalCount ?? 0} />
        <Pagination />
      </div>
    </div>
  );
}
