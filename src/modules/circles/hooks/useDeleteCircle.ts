import { useMutation } from '@tanstack/react-query';

type UseDeleteCircleArgs = {
    onSuccess?: () => void;
};

export default function useDeleteCircle({ onSuccess }: UseDeleteCircleArgs = {}) {
    return useMutation({
        mutationFn: async (id: string) => id,
        onSuccess,
    });
}
