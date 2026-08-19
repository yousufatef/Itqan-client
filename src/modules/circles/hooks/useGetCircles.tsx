import { useQuery } from '@tanstack/react-query';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import type { ICircle } from '../types';

export const CIRCLES_QUERY_KEY = ['circles'];

const dummyCircles: ICircle[] = [
    {
        id: '1',
        name: 'حلقة النور',
        teacherName: 'أحمد حسن',
        startTime: '05:00',
        endTime: '06:00',
        days: ['الأحد', 'الإثنين'],
        isActive: true,
        createdAt: '2026-01-10T10:00:00.000Z',
        updatedAt: '2026-01-10T10:00:00.000Z',
    },
    {
        id: '2',
        name: 'حلقة الإتقان',
        teacherName: 'سارة علي',
        startTime: '06:00',
        endTime: '07:00',
        days: ['الثلاثاء', 'الخميس'],
        isActive: true,
        createdAt: '2026-02-03T10:00:00.000Z',
        updatedAt: '2026-02-03T10:00:00.000Z',
    },
    {
        id: '3',
        name: 'حلقة الهدى',
        teacherName: 'محمد سامي',
        startTime: '04:00',
        endTime: '05:00',
        days: ['السبت'],
        isActive: false,
        createdAt: '2026-02-18T10:00:00.000Z',
        updatedAt: '2026-02-18T10:00:00.000Z',
    },
];

export default function useGetCircles() {
    const { searchValue } = useTableSearchParam();

    return useQuery({
        queryKey: [...CIRCLES_QUERY_KEY, searchValue],
        queryFn: async () => {
            const normalizedSearch = searchValue.trim().toLowerCase();
            const data = dummyCircles.filter((circle) =>
                normalizedSearch
                    ? [circle.name, circle.teacherName].some((value) =>
                        value.toLowerCase().includes(normalizedSearch),
                    )
                    : true,
            );

            return { result: { data, totalCount: data.length } };
        },
    });
}

export { dummyCircles };
