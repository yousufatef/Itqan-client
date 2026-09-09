import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTransaction } from '../services/financial.service';
import { TRANSACTIONS_QUERY_KEY } from './financialData';

type UseDeleteTransactionArgs = {
    onSuccess?: () => void;
};

export default function useDeleteTransaction({ onSuccess }: UseDeleteTransactionArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTransaction(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
            onSuccess?.();
        },
    });
}
