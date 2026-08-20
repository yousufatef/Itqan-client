import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IFinancialInvoice } from '../types';
import { financialInvoices, FINANCIAL_QUERY_KEY, normalizeInvoice } from './financialData';

type InvoiceFormValues = Pick<IFinancialInvoice, 'studentName' | 'totalAmount' | 'paidAmount'>;

type UseCreateFinancialInvoiceArgs = {
    onSuccess?: () => void;
};

export default function useCreateFinancialInvoice({ onSuccess }: UseCreateFinancialInvoiceArgs = {}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values: InvoiceFormValues) => {
            const now = new Date().toISOString();
            financialInvoices.push({
                id: `INV-${Date.now()}`,
                ...normalizeInvoice(values),
                createdAt: now,
                updatedAt: now,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: FINANCIAL_QUERY_KEY });
            onSuccess?.();
        },
    });
}
