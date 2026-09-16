import { useQuery } from '@tanstack/react-query';
import { getDailyRecords } from '../services/circles.service';
import { CIRCLE_DAILY_RECORDS_QUERY_KEY } from './circlesData';

export default function useGetDailyRecords(circleId: string | number | undefined, date?: string) {
    return useQuery({
        queryKey: [...CIRCLE_DAILY_RECORDS_QUERY_KEY, circleId, date],
        queryFn: () => (circleId ? getDailyRecords(circleId, date) : []),
        enabled: Boolean(circleId),
    });
}
