import { useMutation } from '@tanstack/react-query';
import type { IStudent } from '../types';

type StudentFormValues = Omit<IStudent, 'id' | 'createdAt' | 'updatedAt'>;

type UseCreateStudentArgs = {
    onSuccess?: () => void;
};

export default function useCreateStudent({ onSuccess }: UseCreateStudentArgs = {}) {
    return useMutation({
        mutationFn: async (values: StudentFormValues) => values,
        onSuccess,
    });
}
