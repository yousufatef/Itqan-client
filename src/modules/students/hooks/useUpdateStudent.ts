import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudent } from '../services/students.service';
import { STUDENTS_QUERY_KEY } from './studentsData';

import type { StudentPayload } from '../services/students.service';

type UseUpdateStudentArgs = {
    onSuccess?: () => void;
};

type UpdateStudentPayload = {
    id: string;
    values: StudentPayload;
};

export default function useUpdateStudent({ onSuccess }: UseUpdateStudentArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, values }: UpdateStudentPayload) => updateStudent(id, values),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
            onSuccess?.();
        },
    });
}
