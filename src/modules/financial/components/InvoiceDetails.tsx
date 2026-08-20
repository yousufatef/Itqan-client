import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { IFinancialInvoice, InvoiceStatus } from '../types';

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

function AmountRow({ label, value }: { label: string; value: number }) {
    return (
        <div className='flex items-center justify-between border-b border-neutral-100 py-4 last:border-0'>
            <span className='text-sm text-neutral-500'>{label}</span>
            <span className='font-semibold text-neutral-900'>{value.toLocaleString('ar-EG')} ج.م</span>
        </div>
    );
}

export default function InvoiceDetails({ invoice }: { invoice: IFinancialInvoice }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant='link'
                className='h-auto p-0 font-semibold text-primary-600'
                onClick={() => setOpen(true)}
            >
                <FileText className='size-4' />
                {invoice.id}
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className='w-full sm:max-w-lg'>
                    <SheetHeader className='border-b border-neutral-100 px-6 py-6'>
                        <SheetTitle className='text-2xl font-bold'>تفاصيل الفاتورة</SheetTitle>
                        <SheetDescription>{invoice.id}</SheetDescription>
                    </SheetHeader>
                    <div className='space-y-6 overflow-y-auto px-6 py-6'>
                        <div className='rounded-xl bg-neutral-50 p-5'>
                            <p className='mb-2 text-xs font-medium text-neutral-500'>اسم الطالب</p>
                            <p className='text-lg font-bold text-neutral-900'>{invoice.studentName}</p>
                        </div>
                        <div className='rounded-xl border border-neutral-100 px-5'>
                            <AmountRow label='المبلغ الكلي' value={invoice.totalAmount} />
                            <AmountRow label='المدفوع' value={invoice.paidAmount} />
                            <AmountRow label='المتبقي' value={invoice.remainingAmount} />
                        </div>
                        <div className='flex items-center justify-between rounded-xl border border-neutral-100 p-5'>
                            <span className='text-sm font-medium text-neutral-500'>حالة الفاتورة</span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[invoice.status]}`}>
                                {statusLabels[invoice.status]}
                            </span>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
