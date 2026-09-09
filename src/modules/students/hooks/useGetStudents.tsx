import { useQuery } from '@tanstack/react-query';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import { getAllStudents } from '../services/students.service';
import { STUDENTS_QUERY_KEY } from './studentsData';

export default function useGetStudents() {
    const { pageNumber, pageSize, searchValue } = useTableSearchParam();

    return useQuery({
        queryKey: [...STUDENTS_QUERY_KEY, pageNumber, pageSize, searchValue],
        queryFn: () => getAllStudents(pageNumber, pageSize, searchValue),
    });
}
