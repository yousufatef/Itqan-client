import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteStudent } from '../services/students.service';
import { STUDENTS_QUERY_KEY } from './studentsData';

type UseDeleteStudentArgs = {
    onSuccess?: () => void;
};

type DeleteStudentParams = {
    id: string;
};

export default function useDeleteStudent({ onSuccess }: UseDeleteStudentArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: DeleteStudentParams) => deleteStudent(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
            onSuccess?.();
        },
    });
}
