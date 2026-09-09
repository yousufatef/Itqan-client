import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTransaction } from '../services/financial.service';
import { TRANSACTIONS_QUERY_KEY } from './financialData';
import type { TransactionPayload } from '../types';

type UseUpdateTransactionArgs = {
    onSuccess?: () => void;
};

type UpdateTransactionPayload = {
    id: number;
    values: TransactionPayload;
};

export default function useUpdateTransaction({ onSuccess }: UseUpdateTransactionArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: UpdateTransactionPayload) => updateTransaction(id, values),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
            onSuccess?.();
        },
    });
}
