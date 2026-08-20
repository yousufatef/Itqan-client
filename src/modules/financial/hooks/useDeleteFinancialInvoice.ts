import { useMutation, useQueryClient } from '@tanstack/react-query';
import { financialInvoices, FINANCIAL_QUERY_KEY } from './financialData';

type UseDeleteFinancialInvoiceArgs = {
    onSuccess?: () => void;
};

export default function useDeleteFinancialInvoice({ onSuccess }: UseDeleteFinancialInvoiceArgs = {}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const index = financialInvoices.findIndex((item) => item.id === id);
            if (index >= 0) financialInvoices.splice(index, 1);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: FINANCIAL_QUERY_KEY });
            onSuccess?.();
        },
    });
}
