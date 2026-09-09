import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '../services/financial.service';
import { CATEGORIES_QUERY_KEY, TRANSACTIONS_QUERY_KEY } from './financialData';

type UseDeleteCategoryArgs = {
    onSuccess?: () => void;
};

export default function useDeleteCategory({ onSuccess }: UseDeleteCategoryArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
            // Transactions reference categories, refresh them too
            void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
            onSuccess?.();
        },
    });
}
