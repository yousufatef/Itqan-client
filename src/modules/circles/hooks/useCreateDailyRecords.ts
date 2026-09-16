import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDailyRecords } from '../services/circles.service';
import { CIRCLE_DAILY_RECORDS_QUERY_KEY } from './circlesData';
import type { CreateDailyRecordItem } from '../types';

type UseCreateDailyRecordsArgs = {
    onSuccess?: () => void;
};

type CreateDailyRecordsParams = {
    circleId: string | number;
    records: CreateDailyRecordItem[];
};

export default function useCreateDailyRecords({ onSuccess }: UseCreateDailyRecordsArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ circleId, records }: CreateDailyRecordsParams) =>
            createDailyRecords(circleId, records),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({
                queryKey: [...CIRCLE_DAILY_RECORDS_QUERY_KEY, variables.circleId],
            });
            onSuccess?.();
        },
    });
}
