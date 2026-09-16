import { formatTo24HourTime } from '@/components/forms/time-input.utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCircle } from '../services/circles.service';
import { CIRCLES_QUERY_KEY } from './circlesData';
import type { ICircle, ITimeObject } from '../types';

function formatTimeTo24H(timeValue: string | ITimeObject | undefined): string {
  if (!timeValue) return '00:00';
  if (typeof timeValue === 'object' && timeValue !== null) {
    const hh = String(timeValue.hour || 0).padStart(2, '0');
    const mm = String(timeValue.minute || 0).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return formatTo24HourTime(timeValue) || '00:00';
}

export default function useToggleCircleStatus(circle: ICircle) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (nextStatus: boolean) => {
      const payload = {
        name: circle.name,
        teacherId: circle.teacherId,
        studentIds: circle.studentIds || (circle.students ? circle.students.map((s) => s.id) : []),
        days: circle.days,
        startTime: formatTimeTo24H(circle.startTime),
        endTime: formatTimeTo24H(circle.endTime),
        isActive: nextStatus,
      };
      return updateCircle(payload, circle.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CIRCLES_QUERY_KEY });
    },
  });

  return {
    isActive: circle.isActive,
    isPending: mutation.isPending,
    toggleStatus: () => mutation.mutate(!circle.isActive),
  };
}
