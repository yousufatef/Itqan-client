import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { exportArabicTableToPdf } from '@/utils/exportArabicPdf';
import type { ColumnDef } from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import useGetCircles from '../../hooks/useGetCircles';
import useToggleCircleStatus from '../../hooks/useToggleCircleStatus';
import type { ICircle, ITimeObject } from '../../types';
import CirclesActions from './CirclesActions';

const DAY_TRANSLATIONS: Record<string, string> = {
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
  Friday: 'الجمعة',
  Saturday: 'السبت',
};

function formatTime(timeVal: string | ITimeObject | undefined) {
  if (!timeVal) return '';
  if (typeof timeVal === 'string') return timeVal;
  const hour = String(timeVal.hour || 0).padStart(2, '0');
  const minute = String(timeVal.minute || 0).padStart(2, '0');
  return `${hour}:${minute}`;
}

function formatDays(days: string[] | undefined) {
  if (!days) return '';
  return days.map((d) => DAY_TRANSLATIONS[d] || d).join('، ');
}

function CircleStatusSwitch({ circle }: { circle: ICircle }) {
  const { isActive, isPending, toggleStatus } = useToggleCircleStatus(circle);

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

  const columns: ColumnDef<ICircle>[] = [
    {
      header: 'اسم الحلقة',
      accessorKey: 'name',
    },
    {
      header: 'المعلم',
      cell: ({ row }) =>
        row.original.teacherName ||
        row.original.teacher?.username ||
        `معلم #${row.original.teacherId}`,
    },
    {
      header: 'الأيام',
      cell: ({ row }) => formatDays(row.original.days),
    },
    {
      header: 'الوقت',
      cell: ({ row }) => `${formatTime(row.original.startTime)} - ${formatTime(row.original.endTime)}`,
    },
    {
      header: 'الحالة',
      cell: ({ row }) => <CircleStatusSwitch circle={row.original} />,
    },
    {
      header: 'الإجراءات',
      cell: ({ row }) => <CirclesActions circle={row.original} />,
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
        {
          header: 'المعلم',
          value: (circle: ICircle) =>
            circle.teacherName || circle.teacher?.username || `معلم #${circle.teacherId}`,
        },
        { header: 'الأيام', value: (circle: ICircle) => formatDays(circle.days) },
        {
          header: 'الوقت',
          value: (circle: ICircle) =>
            `${formatTime(circle.startTime)} - ${formatTime(circle.endTime)}`,
        },
        { header: 'الحالة', value: (circle: ICircle) => (circle.isActive ? 'نشطة' : 'غير نشطة') },
      ],
      rows: items?.data ?? [],
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-4'>
          <CustomSearchBar
            placeholder='ابحث باسم الحلقة'
            ariaLabel='البحث عن حلقة'
            wrapperClassName='max-w-[400px]'
            searchParamName='searchValue'
          />
        </div>

        <Button
          size='default'
          variant='outline'
          onClick={handleExport}
          className='flex items-center gap-1 border border-primary-500 text-primary-500 hover:text-primary-500'
        >
          <Upload className='size-5.5 text-primary' />
          تصدير
        </Button>
      </div>

      <CustomTable
        data={items?.data ?? []}
        columns={columns}
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
