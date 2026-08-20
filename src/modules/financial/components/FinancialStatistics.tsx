import { Card, CardContent } from '@/components/ui/card';
import useGetFinancialInvoices from '../hooks/useGetFinancialInvoices';

export default function FinancialStatistics() {
    const { data } = useGetFinancialInvoices();
    const invoices = data?.result.data ?? [];
    const statistics = [
        {
            label: 'التحصيل',
            value: invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0),
            className: 'text-emerald-600',
        },
        {
            label: 'مصروفات',
            value: invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0),
            className: 'text-primary-600',
        },
        {
            label: 'المتبقي',
            value: invoices.reduce((sum, invoice) => sum + invoice.remainingAmount, 0),
            className: 'text-amber-600',
        },
    ];

    return (
        <div className='grid gap-4 md:grid-cols-3'>
            {statistics.map((statistic) => (
                <Card key={statistic.label} className='rounded-xl border-neutral-100 shadow-sm p-0'>
                    <CardContent className='p-5'>
                        <p className='text-sm text-neutral-500'>{statistic.label}</p>
                        <p className={`mt-2 text-xl font-bold ${statistic.className}`}>
                            {statistic.value.toLocaleString('ar-EG')} ج.م
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
