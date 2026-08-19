import useTableSearchParam from '@/hooks/useTableSearchParam';
// import { useTranslation } from 'react-i18next';

type TableStatisticsProps = {
  totalCount?: number;
};

function TableStatistics({ totalCount }: TableStatisticsProps) {
  const { pageNumber, pageSize } = useTableSearchParam();
  // const { t } = useTranslation();

  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount || 0);

  return (
    // <p className='text-muted-foreground text-sm'>
    //   {t('table.showing', { from: start, to: end, total: totalCount || 0 })}
    // </p>
    <p className='text-muted-foreground text-sm'>
      عرض {start} إلى {end} من أصل {totalCount || 0}
    </p>
  );
}

export default TableStatistics;
