import { useMutation } from '@tanstack/react-query';
import type { IStudent } from '../types';

type StudentFormValues = Omit<IStudent, 'id' | 'createdAt' | 'updatedAt'>;

type UseUpdateStudentArgs = {
    onSuccess?: () => void;
};

type UpdateStudentPayload = {
    id: string;
    values: StudentFormValues;
};

export default function useUpdateStudent({ onSuccess }: UseUpdateStudentArgs = {}) {
    return useMutation({
        mutationFn: async ({ values }: UpdateStudentPayload) => values,
        onSuccess,
    });
}
