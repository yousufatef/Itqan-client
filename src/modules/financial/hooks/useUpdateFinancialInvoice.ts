import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IFinancialInvoice } from '../types';
import { financialInvoices, FINANCIAL_QUERY_KEY, normalizeInvoice } from './financialData';

type InvoiceFormValues = Pick<IFinancialInvoice, 'studentName' | 'totalAmount' | 'paidAmount'>;

type UseUpdateFinancialInvoiceArgs = {
    onSuccess?: () => void;
};

type UpdateStudentPayload = {
    id: string;
    values: InvoiceFormValues;
};

export default function useUpdateFinancialInvoice({ onSuccess }: UseUpdateFinancialInvoiceArgs = {}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, values }: UpdateStudentPayload) => {
            const invoice = financialInvoices.find((item) => item.id === id);
            if (invoice) Object.assign(invoice, normalizeInvoice(values), { updatedAt: new Date().toISOString() });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: FINANCIAL_QUERY_KEY });
            onSuccess?.();
        },
    });
}
