import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction } from '../services/financial.service';
import { TRANSACTIONS_QUERY_KEY } from './financialData';
import type { TransactionPayload } from '../types';

type UseCreateTransactionArgs = {
    onSuccess?: () => void;
};

export default function useCreateTransaction({ onSuccess }: UseCreateTransactionArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: TransactionPayload) => createTransaction(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
            onSuccess?.();
        },
    });
}
