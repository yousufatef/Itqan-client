import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../services/financial.service';
import { CATEGORIES_QUERY_KEY } from './financialData';
import type { CategoryPayload } from '../types';

type UseCreateCategoryArgs = {
    onSuccess?: () => void;
};

export default function useCreateCategory({ onSuccess }: UseCreateCategoryArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CategoryPayload) => createCategory(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
            onSuccess?.();
        },
    });
}
