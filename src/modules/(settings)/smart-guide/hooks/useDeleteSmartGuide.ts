import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { SMART_GUIDE_QUERY_KEY } from '../constants/smartGuide.constants';
import { deleteSmartGuide } from '../services/smart-guide.service';
import { useTranslation } from 'react-i18next';

type UseDeleteSmartGuideOptions = {
  onSuccess?: () => void;
};

export default function useDeleteSmartGuide(options?: UseDeleteSmartGuideOptions) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: (id: string) => deleteSmartGuide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SMART_GUIDE_QUERY_KEY] });
      toast.success(t('smartGuide.actions.deleteSuccess', 'Smart Guide deleted successfully'));
      options?.onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete Smart Guide');
    },
  });
}
