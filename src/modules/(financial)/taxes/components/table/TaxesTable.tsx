import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MainLoader from '@/components/shared/loader/MainLoader';
import LoadingError from '@/components/shared/error/LoadingError';
import ToggleStatus from '@/components/shared/customs/ToggleStatus';
import { RecordType } from '@/types/index.t';
import TaxesActions from './TaxesActions';
import type { Tax } from '../../types/taxes.types';
import useAllTaxes from '../../hooks/useAllTaxes';

export default function TaxesTable() {
  const { t } = useTranslation();

  const columns: ColumnDef<Tax>[] = [
    { header: t('taxes.table.nameEn'), accessorKey: 'nameEn' },
    { header: t('taxes.table.nameIt'), accessorKey: 'nameIt' },
    { header: t('taxes.table.type'), accessorKey: 'typeName' },
    {
      header: t('taxes.table.taxRate'),
      accessorKey: 'rate',
      cell: ({
        row: {
          original: { rate, calculationType },
        },
      }) => (calculationType === 0 ? `${rate}€` : `${rate}%`),
    },
    {
      header: t('taxes.table.status'),
      cell: ({
        row: {
          original: { id, isActive },
        },
      }) => (
        <ToggleStatus
          id={id}
          checked={isActive}
          recordType={RecordType.Tax}
        />
      ),
    },
    {
      header: t('taxes.table.actions'),
      cell: ({ row: { original: tax } }) => <TaxesActions tax={tax} />,
    },
  ];

  const { data, isLoading, isError, error, isFetching } = useAllTaxes();

  if (isLoading) return <MainLoader />;
  if (isError) return <LoadingError errorMsg={error.message} />;

  const taxes = data?.result?.result ?? [];

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <CustomSearchBar
          placeholder={t('taxes.searchPlaceholder')}
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
        data={taxes ?? []}
        columns={columns}
        isFetching={isFetching}
      />
      <div className='flex items-center justify-between'>
        <TableStatistics totalCount={data?.result?.totalCount ?? 0} />
        <Pagination
          totalCount={data?.result?.totalCount ?? 0}
          currentCount={data?.result?.result.length}
        />
      </div>
    </div>
  );
}
