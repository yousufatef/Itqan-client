import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MainLoader from '@/components/shared/loader/MainLoader';
import LoadingError from '@/components/shared/error/LoadingError';
import useSmartGuide from '../../hooks/useSmartGuide';
import type { HowToUseApp } from '../../types/smart-guide.types';
import SmartGuideActions from './SmartGuideActions';

export default function SmartGuideTable() {
  const { t } = useTranslation();

  const columns: ColumnDef<HowToUseApp>[] = [
    { header: t('smartGuide.table.titleEn'), accessorKey: 'titleEn' },
    { header: t('smartGuide.table.titleIt'), accessorKey: 'titleIt' },
    {
      header: t('smartGuide.table.descriptionEn', 'Description (EN)'),
      cell: ({ row: { original: guide } }) => (
        <div className='max-w-65 truncate' title={guide.descriptionEn || ''}>
          {guide.descriptionEn || '—'}
        </div>
      ),
    },
    {
      header: t('smartGuide.table.descriptionIt'),
      cell: ({ row: { original: guide } }) => (
        <div className='max-w-65 truncate' title={guide.descriptionIt || ''}>
          {guide.descriptionIt || '—'}
        </div>
      ),
    },
    {
      header: t('smartGuide.table.actions', 'Actions'),
      cell: ({ row: { original: guide } }) => <SmartGuideActions smartGuide={guide} />,
    },
  ];

  const { data, isLoading, isError, error, isFetching } = useSmartGuide();

  if (isLoading) return <MainLoader />;
  if (isError) return <LoadingError errorMsg={error.message} />;

  const smartGuides = data?.result?.items ?? [];

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <CustomSearchBar
          placeholder={t('smartGuide.searchPlaceholder', 'Search smart guides...')}
          wrapperClassName='max-w-[400px]'
          searchParamName='searchValue'
        />

        <Button
          size={'default'}
          variant={'outline'}
          className='flex items-center gap-1'
        >
          <Upload className='text-primary size-5.5' />
          {t('smartGuide.export', 'Export')}
        </Button>
      </div>
      <CustomTable
        data={smartGuides ?? []}
        columns={columns}
        isFetching={isFetching}
      />
      <div className='flex items-center justify-between'>
        <TableStatistics totalCount={data?.result?.totalCount ?? 0} />
        <Pagination
          totalCount={data?.result?.totalCount ?? 0}
          currentCount={smartGuides.length}
        />
      </div>
    </div>
  );
}
