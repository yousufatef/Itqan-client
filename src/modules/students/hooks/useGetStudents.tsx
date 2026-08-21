import { useQuery } from '@tanstack/react-query';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import type { IStudent } from '../types';

export const STUDENTS_QUERY_KEY = ['students'];

const dummyStudents: IStudent[] = [
    {
        id: '1',
        name: 'أحمد حسن',
        phone: '+201001234567',
        dateOfBirth: '2015-03-12',
        parentId: '3',
        createdAt: '2026-01-10T10:00:00.000Z',
        updatedAt: '2026-01-10T10:00:00.000Z',
    },
    {
        id: '2',
        name: 'سارة علي',
        phone: '+201112345678',
        dateOfBirth: '2014-08-24',
        parentId: '3',
        createdAt: '2026-02-03T10:00:00.000Z',
        updatedAt: '2026-02-03T10:00:00.000Z',
    },
    {
        id: '3',
        name: 'محمد سامي',
        phone: '+201223456789',
        dateOfBirth: '2016-01-06',
        parentId: '3',
        createdAt: '2026-02-18T10:00:00.000Z',
        updatedAt: '2026-02-18T10:00:00.000Z',
    },
];

export default function useGetStudents() {
    const { searchValue } = useTableSearchParam();

    return useQuery({
        queryKey: [...STUDENTS_QUERY_KEY, searchValue],
        queryFn: async () => {
            const normalizedSearch = searchValue.trim().toLowerCase();
            const data = dummyStudents.filter((student) =>
                normalizedSearch
                    ? [student.name, student.phone].some((value) =>
                        value.toLowerCase().includes(normalizedSearch),
                    )
                    : true,
            );

            return { result: { data, totalCount: data.length } };
        },
    });
}
