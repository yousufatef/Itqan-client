import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory } from '../services/financial.service';
import { CATEGORIES_QUERY_KEY } from './financialData';
import type { CategoryPayload } from '../types';

type UseUpdateCategoryArgs = {
    onSuccess?: () => void;
};

type UpdateCategoryPayload = {
    id: number;
    values: CategoryPayload;
};

export default function useUpdateCategory({ onSuccess }: UseUpdateCategoryArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: UpdateCategoryPayload) => updateCategory(id, values),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
            onSuccess?.();
        },
    });
}
