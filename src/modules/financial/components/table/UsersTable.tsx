import { CustomSearchBar, CustomTable } from '@/components/shared/customs';
import Pagination from '@/components/shared/customs/CustomPagination';
import TableStatistics from '@/components/shared/customs/TableStatistics';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@tanstack/react-table';
import { Upload } from 'lucide-react';
import { exportArabicTableToPdf } from '@/utils/exportArabicPdf';
import type { IFinancialInvoice, InvoiceStatus } from '../../types';
import InvoiceDetails from '../InvoiceDetails';
import FinancialActions from './FinancialActions';
import useGetFinancialInvoices from '../../hooks/useGetFinancialInvoices';

const statusLabels: Record<InvoiceStatus, string> = {
  unpaid: 'غير مدفوع',
  partial: 'مدفوع جزئياً',
  paid: 'مدفوع',
};

const statusClasses: Record<InvoiceStatus, string> = {
  unpaid: 'bg-red-50 text-red-700',
  partial: 'bg-amber-50 text-amber-700',
  paid: 'bg-emerald-50 text-emerald-700',
};

export default function FinancialUsersTable() {
  const { data, isPending, isError } = useGetFinancialInvoices();

  // const { data, isPending, isError, error, isFetching } = useItems();

  const columns: ColumnDef<IFinancialInvoice>[] = [
    {
      header: 'اسم الطالب',
      accessorKey: 'studentName',
    },
    {
      header: 'المبلغ الكلي',
      accessorKey: 'totalAmount',
      cell: ({ getValue }) => `${getValue<number>().toLocaleString('ar-EG')} ج.م`,
    },
    {
      header: 'الحالة',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue<InvoiceStatus>();
        return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>{statusLabels[status]}</span>;
      },
    },
    {
      header: 'رقم الفاتورة',
      accessorKey: 'id',
      cell: ({ row }) => <InvoiceDetails invoice={row.original} />,
    },
    {
      header: 'الإجراءات',
      cell: ({ row }) => (
        <FinancialActions student={row.original} />
      ),
    },
  ];

  if (isPending) return <div className='py-8 text-center'>جاري تحميل الفواتير...</div>;
  if (isError) return <div className='py-8 text-center'>تعذر تحميل الفواتير.</div>;

  const items = data?.result;

  const handleExport = () => {
    void exportArabicTableToPdf({
      title: 'الطلاب',
      filename: 'الطلاب',
      columns: [
        { header: 'اسم الطالب', value: (invoice: IFinancialInvoice) => invoice.studentName },
        { header: 'المبلغ الكلي', value: (invoice: IFinancialInvoice) => invoice.totalAmount },
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
