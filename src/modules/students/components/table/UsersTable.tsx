import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import StudentsActions from './UsersActions';
import useGetStudents from '../../hooks/useGetStudents';
import { exportArabicTableToPdf } from '@/utils/exportArabicPdf';
import type { IStudent } from '../../types';
import useGetUsers from '@/modules/users/hooks/useGetUsers';

export default function StudentsTable() {
  const { data, isPending, isError } = useGetStudents();
  const { data: usersData } = useGetUsers({ searchValue: '', role: 'parent' });
  const parentNames = new Map(
    (usersData?.result.data ?? [])
      .filter((user) => user.role === 'parent')
      .map((user) => [user.id, user.username]),
  );

  // const { data, isPending, isError, error, isFetching } = useItems();

  const columns: ColumnDef<IStudent>[] = [
    {
      header: 'اسم الطالب',
      accessorKey: 'name',
    },
    {
      header: 'رقم الهاتف',
      accessorKey: 'phone',
    },
    {
      header: 'تاريخ الميلاد',
      accessorKey: 'dateOfBirth',
    },
    {
      header: 'ولي الأمر',
      accessorFn: (student) => parentNames.get(student.parentId) ?? 'غير محدد',
      id: 'parent',
    },
    {
      header: 'الإجراءات',
      cell: ({ row }) => (
        <StudentsActions student={row.original} />
      ),
    },
  ];

  if (isPending) return <div className='py-8 text-center'>جاري تحميل الطلاب...</div>;
  if (isError) return <div className='py-8 text-center'>تعذر تحميل الطلاب.</div>;

  const items = data?.result;

  const handleExport = () => {
    void exportArabicTableToPdf({
      title: 'الطلاب',
      filename: 'الطلاب',
      columns: [
        { header: 'اسم الطالب', value: (student: IStudent) => student.name },
        { header: 'رقم الهاتف', value: (student: IStudent) => student.phone },
        { header: 'تاريخ الميلاد', value: (student: IStudent) => student.dateOfBirth },
        { header: 'ولي الأمر', value: (student: IStudent) => parentNames.get(student.parentId) ?? 'غير محدد' },
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
