import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCircle } from '../services/circles.service';
import { CIRCLES_QUERY_KEY } from './circlesData';

type UseDeleteCircleArgs = {
    onSuccess?: () => void;
};

export default function useDeleteCircle({ onSuccess }: UseDeleteCircleArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => deleteCircle(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEY });
            onSuccess?.();
        },
    });
}
