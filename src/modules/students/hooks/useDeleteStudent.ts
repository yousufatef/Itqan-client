import { useMutation } from '@tanstack/react-query';

type UseDeleteStudentArgs = {
    onSuccess?: () => void;
};

export default function useDeleteStudent({ onSuccess }: UseDeleteStudentArgs = {}) {
    return useMutation({
        mutationFn: async (id: string) => id,
        onSuccess,
    });
}
