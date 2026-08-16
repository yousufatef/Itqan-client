import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parse } from 'date-fns';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MainLoader from '@/components/shared/loader/MainLoader';
import LoadingError from '@/components/shared/error/LoadingError';
import ToggleStatus from '@/components/shared/customs/ToggleStatus';
import { RecordType } from '@/types/index.t';
import PromoActions from './PromoActions';
import type { PromoCode } from '../../types/promo.types';
import usePromoCodes from '../../hooks/usePromoCodes';

export default function PromoCodeTable() {
  const { t } = useTranslation();

  const columns: ColumnDef<PromoCode>[] = [
    { header: t('promo.table.nameEn'), accessorKey: 'codeNameEn' },
    { header: t('promo.table.nameIt'), accessorKey: 'codeNameIt' },
    { header: t('promo.table.code'), accessorKey: 'code' },
    {
      header: t('promo.table.discount'),
      accessorKey: 'discountValue',
      cell: ({
        row: {
          original: { discountValue, discountType },
        },
      }) => `${discountValue}${discountType === 1 ? '%' : '€'}`,
    },
    { header: t('promo.table.maxUses'), accessorKey: 'maxUsesPerUser' },
    {
      header: t('promo.table.startDate'),
      accessorKey: 'startDate',
      cell: ({
        row: {
          original: { startDate },
        },
      }) => {
        if (!startDate) return '-';
        try {
          return format(parse(startDate, 'dd-MM-yyyy', new Date()), 'dd-MM-yyyy');
        } catch {
          return startDate;
        }
      },
    },
    {
      header: t('promo.table.endDate'),
      accessorKey: 'endDate',
      cell: ({
        row: {
          original: { endDate },
        },
      }) => {
        if (!endDate) return '-';
        try {
          return format(parse(endDate, 'dd-MM-yyyy', new Date()), 'dd-MM-yyyy');
        } catch {
          return endDate;
        }
      },
    },

    {
      header: t('promo.table.status'),
      cell: ({
        row: {
          original: { id, isActive },
        },
      }) => (
        <ToggleStatus
          id={id}
          checked={isActive}
          recordType={RecordType.PromoCode}
        />
      ),
    },
    {
      header: t('taxes.table.actions'),
      cell: ({ row: { original: promo } }) => <PromoActions promo={promo} />,
    },
  ];

  const { data, isLoading, isError, error, isFetching } = usePromoCodes();

  if (isLoading) return <MainLoader />;
  if (isError) return <LoadingError errorMsg={error.message} />;

  const taxes = data?.result?.items ?? [];

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <CustomSearchBar
          placeholder={t('promo.searchPlaceholder')}
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
          currentCount={data?.result?.items?.length ?? 0}
        />
      </div>
    </div>
  );
}
