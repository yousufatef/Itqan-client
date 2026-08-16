import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { updateSmartGuide } from '../services/smart-guide.service';
import { SMART_GUIDE_QUERY_KEY } from '../constants/smartGuide.constants';

type UseUpdateSmartGuideArgs = {
  onSuccess?: () => void;
};

export default function useUpdateSmartGuide({ onSuccess }: UseUpdateSmartGuideArgs = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => updateSmartGuide(payload),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [SMART_GUIDE_QUERY_KEY] });
      toast.success(res?.message ?? 'Smart Guide updated successfully');
      onSuccess?.();
    },
  });
}
