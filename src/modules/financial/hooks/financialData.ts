import type { IFinancialInvoice } from '../types';

export const FINANCIAL_QUERY_KEY = ['financial-invoices'];

export const financialInvoices: IFinancialInvoice[] = [
    {
        id: 'INV-2026-001',
        studentName: 'أحمد حسن',
        totalAmount: 4500,
        paidAmount: 4500,
        remainingAmount: 0,
        status: 'paid',
        createdAt: '2026-01-10T10:00:00.000Z',
        updatedAt: '2026-01-10T10:00:00.000Z',
    },
    {
        id: 'INV-2026-002',
        studentName: 'سارة علي',
        totalAmount: 6000,
        paidAmount: 2500,
        remainingAmount: 3500,
        status: 'partial',
        createdAt: '2026-02-03T10:00:00.000Z',
        updatedAt: '2026-02-03T10:00:00.000Z',
    },
    {
        id: 'INV-2026-003',
        studentName: 'محمد سامي',
        totalAmount: 3200,
        paidAmount: 0,
        remainingAmount: 3200,
        status: 'unpaid',
        createdAt: '2026-02-18T10:00:00.000Z',
        updatedAt: '2026-02-18T10:00:00.000Z',
    },
];

export function normalizeInvoice(
    values: Pick<IFinancialInvoice, 'studentName' | 'totalAmount' | 'paidAmount'>,
): Pick<IFinancialInvoice, 'studentName' | 'totalAmount' | 'paidAmount' | 'remainingAmount' | 'status'> {
    const totalAmount = Math.max(0, Number(values.totalAmount));
    const paidAmount = Math.min(totalAmount, Math.max(0, Number(values.paidAmount)));

    return {
        studentName: values.studentName,
        totalAmount,
        paidAmount,
        remainingAmount: totalAmount - paidAmount,
        status: paidAmount === 0 ? 'unpaid' : paidAmount >= totalAmount ? 'paid' : 'partial',
    };
}