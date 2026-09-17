import { toast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDailyRecord } from '../services/circles.service';
import { CIRCLE_DAILY_RECORDS_QUERY_KEY } from './circlesData';
import type { CreateDailyRecordItem } from '../types';

type UseCreateDailyRecordArgs = {
    onSuccess?: () => void;
};

type CreateDailyRecordParams = {
    circleId: string | number;
    payload: CreateDailyRecordItem;
    date?: string;
};

export default function useCreateDailyRecord({ onSuccess }: UseCreateDailyRecordArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ circleId, payload, date }: CreateDailyRecordParams) =>
            createDailyRecord(circleId, payload, date),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({
                queryKey: [...CIRCLE_DAILY_RECORDS_QUERY_KEY, variables.circleId],
            });
            toast.success('تم تسجيل حضور الطالب بنجاح');
            onSuccess?.();
        },
    });
}
