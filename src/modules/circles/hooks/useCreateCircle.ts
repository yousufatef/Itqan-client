import { useMutation } from '@tanstack/react-query';
import type { ICircle } from '../types';

type CircleFormValues = Omit<ICircle, 'id' | 'createdAt' | 'updatedAt'>;

type UseCreateCircleArgs = {
    onSuccess?: () => void;
};

export default function useCreateCircle({ onSuccess }: UseCreateCircleArgs = {}) {
    return useMutation({
        mutationFn: async (values: CircleFormValues) => values,
        onSuccess,
    });
}
