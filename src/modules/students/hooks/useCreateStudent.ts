import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent } from '../services/students.service';
import { STUDENTS_QUERY_KEY } from './studentsData';

import type { StudentPayload } from '../services/students.service';

type UseCreateStudentArgs = {
    onSuccess?: () => void;
};

export default function useCreateStudent({ onSuccess }: UseCreateStudentArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: StudentPayload) => createStudent(values),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
            onSuccess?.();
        },
    });
}
