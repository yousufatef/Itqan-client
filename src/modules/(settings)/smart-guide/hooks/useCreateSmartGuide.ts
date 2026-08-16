import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { createSmartGuide } from '../services/smart-guide.service';
import { SMART_GUIDE_QUERY_KEY } from '../constants/smartGuide.constants';

type UseCreateSmartGuideArgs = {
  onSuccess?: () => void;
};

export default function useCreateSmartGuide({ onSuccess }: UseCreateSmartGuideArgs = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => createSmartGuide(payload),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [SMART_GUIDE_QUERY_KEY] });
      toast.success(res?.message ?? 'Smart Guide created successfully');
      onSuccess?.();
    },
  });
}
