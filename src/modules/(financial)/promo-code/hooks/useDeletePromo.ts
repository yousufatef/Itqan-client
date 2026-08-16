import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { FINANCIAL_PROMO_QUERY_KEY } from '../constants/promo.constants';
import { deletePromoCode } from '../services/promo.service';
import { useTranslation } from 'react-i18next';

type UseDeletePromoOptions = {
  onSuccess?: () => void;
};

export default function useDeletePromoCode(options?: UseDeletePromoOptions) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_PROMO_QUERY_KEY] });
      toast.success(t('promo.actions.deleteSuccess'));
      options?.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
