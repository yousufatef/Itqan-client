import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCircle } from '../services/circles.service';
import { CIRCLES_QUERY_KEY } from './circlesData';
import type { CreateCirclePayload } from '../types';

type UseCreateCircleArgs = {
    onSuccess?: () => void;
};

export default function useCreateCircle({ onSuccess }: UseCreateCircleArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: CreateCirclePayload) => createCircle(values),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEY });
            onSuccess?.();
        },
    });
}
