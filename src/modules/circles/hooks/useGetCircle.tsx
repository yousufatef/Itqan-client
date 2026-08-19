import { useQuery } from '@tanstack/react-query';
import { dummyCircles } from './useGetCircles';

export default function useGetCircle(id: string | undefined) {
    return useQuery({
        queryKey: ['circle', id],
        queryFn: async () => dummyCircles.find((circle) => circle.id === id) ?? null,
        enabled: Boolean(id),
    });
}
