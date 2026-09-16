import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCircle } from '../services/circles.service';
import { CIRCLES_QUERY_KEY } from './circlesData';
import type { UpdateCirclePayload } from '../types';

type UseUpdateCircleArgs = {
    onSuccess?: () => void;
};

type UpdateCircleParams = {
    id?: string | number;
    values: UpdateCirclePayload;
};

export default function useUpdateCircle({ onSuccess }: UseUpdateCircleArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: UpdateCircleParams) => updateCircle(values, id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEY });
            onSuccess?.();
        },
    });
}
