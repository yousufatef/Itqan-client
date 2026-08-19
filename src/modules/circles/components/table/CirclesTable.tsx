import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { ColumnDef } from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import CirclesActions from './CirclesActions';
import useGetCircles from '../../hooks/useGetCircles';
import useToggleCircleStatus from '../../hooks/useToggleCircleStatus';
import { exportArabicTableToPdf } from '@/utils/exportArabicPdf';
import type { ICircle } from '../../types';

function CircleStatusSwitch({ circle }: { circle: ICircle }) {
  const { isActive, isPending, toggleStatus } = useToggleCircleStatus(circle.isActive);

  return (
    <Switch
      aria-label={isActive ? 'تعطيل الحلقة' : 'تفعيل الحلقة'}
      checked={isActive}
      disabled={isPending}
      onCheckedChange={toggleStatus}
      size='sm'
    />
  );
}

export default function CirclesTable() {
  const { data, isPending, isError } = useGetCircles();

  // const { data, isPending, isError, error, isFetching } = useItems();

  const columns: ColumnDef<ICircle>[] = [
    {
      header: 'اسم الحلقة',
      accessorKey: 'name',
    },
    {
      header: 'المعلم',
      accessorKey: 'teacherName',
    },
    {
      header: 'الأيام',
      cell: ({ row }) => row.original.days.join('، '),
    },
    {
      header: 'الوقت',
      cell: ({ row }) => `${row.original.startTime} - ${row.original.endTime}`,
    },
    {
      header: 'الحالة',
      cell: ({ row }) => <CircleStatusSwitch circle={row.original} />,
    },
    {
      header: 'الإجراءات',
      cell: ({ row }) => (
        <CirclesActions circle={row.original} />
      ),
    },
  ];

  if (isPending) return <div className='py-8 text-center'>جاري تحميل الحلقات...</div>;
  if (isError) return <div className='py-8 text-center'>تعذر تحميل الحلقات.</div>;

  const items = data?.result;

  const handleExport = () => {
    void exportArabicTableToPdf({
      title: 'الحلقات',
      filename: 'الحلقات',
      columns: [
        { header: 'اسم الحلقة', value: (circle: ICircle) => circle.name },
        { header: 'المعلم', value: (circle: ICircle) => circle.teacherName },
        { header: 'الأيام', value: (circle: ICircle) => circle.days.join('، ') },
        { header: 'الوقت', value: (circle: ICircle) => `${circle.startTime} - ${circle.endTime}` },
        { header: 'الحالة', value: (circle: ICircle) => (circle.isActive ? 'نشطة' : 'غير نشطة') },
      ],
      rows: items?.data ?? [],
    });
  };

  return (
    <div className="space-y-4">
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-4'>
          <CustomSearchBar
            placeholder='ابحث باسم الطالب'
            ariaLabel='البحث عن طالب'
            wrapperClassName='max-w-[400px]'
            searchParamName="searchValue"
          />
        </div>

        <Button
          size="default"
          variant="outline"
          onClick={handleExport}
          className="flex items-center gap-1 border border-primary-500 text-primary-500 hover:text-primary-500"
        >
          <Upload className="text-primary size-5.5" />
          تصدير
        </Button>
      </div>

      <CustomTable
        data={items?.data ?? []}
        columns={columns}
      // isFetching={isFetching}
      />

      <div className='flex items-center justify-between'>
        <TableStatistics totalCount={items?.totalCount ?? 0} />
        <div className='flex-1'>
          <Pagination
            totalCount={items?.totalCount ?? 0}
            currentCount={items?.data.length ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
