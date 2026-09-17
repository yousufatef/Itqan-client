import { toast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDailyRecord } from '../services/circles.service';
import { CIRCLE_DAILY_RECORDS_QUERY_KEY } from './circlesData';
import type { UpdateDailyRecordItem } from '../types';

type UseUpdateDailyRecordArgs = {
    onSuccess?: () => void;
};

type UpdateDailyRecordParams = {
    circleId: string | number;
    recordId: string | number;
    payload: UpdateDailyRecordItem;
    date?: string;
};

export default function useUpdateDailyRecord({ onSuccess }: UseUpdateDailyRecordArgs = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ circleId, recordId, payload, date }: UpdateDailyRecordParams) =>
            updateDailyRecord(circleId, recordId, payload, date),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({
                queryKey: [...CIRCLE_DAILY_RECORDS_QUERY_KEY, variables.circleId],
            });
            toast.success('تم تحديث تقييم الطالب بنجاح');
            onSuccess?.();
        },
    });
}
