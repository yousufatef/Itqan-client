import { useMutation } from '@tanstack/react-query';
import type { ICircle } from '../types';

type CircleFormValues = Omit<ICircle, 'id' | 'createdAt' | 'updatedAt'>;

type UseUpdateCircleArgs = {
    onSuccess?: () => void;
};

export default function useUpdateCircle({ onSuccess }: UseUpdateCircleArgs = {}) {
    return useMutation({
        mutationFn: async (payload: { id: string; values: CircleFormValues }) => payload,
        onSuccess,
    });
}
