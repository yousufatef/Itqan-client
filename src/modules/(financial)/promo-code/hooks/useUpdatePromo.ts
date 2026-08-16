import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { updatePromoCode, type UpdatePromoCodePayload } from '../services/promo.service';
import { FINANCIAL_PROMO_QUERY_KEY } from '../constants/promo.constants';

type UseUpdateTaxArgs = {
  onSuccess?: () => void;
};

export default function useUpdateTax({ onSuccess }: UseUpdateTaxArgs) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdatePromoCodePayload>({
    mutationFn: updatePromoCode,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_PROMO_QUERY_KEY] });
      toast.success(res?.message ?? 'Promo code updated successfully');
      onSuccess?.();
    },
  });
}
