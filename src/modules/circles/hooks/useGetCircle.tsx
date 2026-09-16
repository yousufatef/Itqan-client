import { useQuery } from '@tanstack/react-query';
import { getCircleById } from '../services/circles.service';
import { CIRCLES_QUERY_KEY } from './circlesData';

export default function useGetCircle(id: string | number | undefined) {
    return useQuery({
        queryKey: [...CIRCLES_QUERY_KEY, 'detail', id],
        queryFn: () => (id ? getCircleById(id) : null),
        enabled: Boolean(id),
    });
}
