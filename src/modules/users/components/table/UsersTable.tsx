import { CustomSearchBar, CustomSelectorFilter, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { ColumnDef } from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import type { IUser } from '../../types';
import UsersActions from './UsersActions';
import useToggleUserStatus from '../../hooks/useToggleUserStatus';
import { exportArabicTableToPdf } from '@/utils/exportArabicPdf';
import useGetUsers from '../../hooks/useGetUsers';

const roleLabels = {
  super_admin: 'مدير النظام',
  admin: 'مسؤول',
  parent: 'ولي أمر',
  teacher: 'معلم',
} as const;

function UserStatusSwitch({ user }: { user: IUser }) {
  const { isActive, isPending, toggleStatus } = useToggleUserStatus(user.isActive);

  return (
    <Switch
      aria-label={isActive ? 'تعطيل المستخدم' : 'تفعيل المستخدم'}
      checked={isActive}
      disabled={isPending}
      onCheckedChange={toggleStatus}
      size='sm'
    />
  );
}

export default function UsersTable() {
  const { data, isPending, isError } = useGetUsers();


  const columns: ColumnDef<IUser>[] = [

    {
      header: "اسم المستخدم",
      accessorKey: 'username',
    },
    {
      header: "البريد الإلكتروني",
      accessorKey: 'email',
    },
    {
      header: 'رقم الهاتف',
      accessorKey: 'phoneNumber',
    },
    {
      header: 'الدور',
      cell: ({ row }) => roleLabels[row.original.userType] || 'غير معروف',
    },
    {
      header: 'الحالة',
      cell: ({ row }) => <UserStatusSwitch user={row.original} />,
    },
    {
      header: 'الإجراءات',
      cell: ({ row }) => (
        <UsersActions user={row.original} />
      ),
    },
  ];

  if (isPending) return <div className='py-8 text-center'>جاري تحميل المستخدمين...</div>;
  if (isError) return <div className='py-8 text-center'>تعذر تحميل المستخدمين.</div>;

  const users = data?.result;

  const handleExport = () => {
    void exportArabicTableToPdf({
      title: 'المستخدمون',
      filename: 'المستخدمون',
      columns: [
        { header: 'اسم المستخدم', value: (user: IUser) => user.username },
        { header: 'البريد الإلكتروني', value: (user: IUser) => user.email },
        { header: 'رقم الهاتف', value: (user: IUser) => user.phoneNumber },
        { header: 'الدور', value: (user: IUser) => roleLabels[user.userType] },
        { header: 'الحالة', value: (user: IUser) => (user.isActive ? 'نشط' : 'غير نشط') },
      ],
      rows: users?.data ?? [],
    });
  };

  return (
    <div className="space-y-4">
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-4'>
          <CustomSearchBar
            placeholder='ابحث باسم المستخدم أو البريد الإلكتروني أو رقم الهاتف'
            ariaLabel='البحث عن مستخدم'
            wrapperClassName='max-w-[400px]'
            searchParamName="searchValue"
          />

          <CustomSelectorFilter
            fildName='role'
            placeholder='تصفية حسب الدور'
            items={[
              { value: 'all', labelEn: 'All roles', labelAr: 'كل الأدوار' },
              { value: 'admin', labelEn: 'Administrator', labelAr: 'مسؤول' },
              { value: 'parent', labelEn: 'Parent', labelAr: 'ولي أمر' },
              { value: 'teacher', labelEn: 'Teacher', labelAr: 'معلم' },
            ]}
            wrapperClassName='min-h-12 w-[180px] border-neutral-100 bg-transparent'
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
        data={users?.data ?? []}
        columns={columns}
      // isFetching={isFetching}
      />

      <div className='flex items-center justify-between'>
        <TableStatistics totalCount={users?.meta.total ?? 0} />
        <div className='flex-1'>
          <Pagination
            totalCount={users?.meta.total ?? 0}
            currentCount={users?.data.length ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
