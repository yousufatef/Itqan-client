import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { createPromoCode, type CreatePromoCodePayload } from '../services/promo.service';
import { FINANCIAL_PROMO_QUERY_KEY } from '../constants/promo.constants';

type UseCreateTaxArgs = {
  onSuccess?: () => void;
};

export default function useCreateTax({ onSuccess }: UseCreateTaxArgs) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreatePromoCodePayload>({
    mutationFn: createPromoCode,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_PROMO_QUERY_KEY] });
      toast.success(res?.message ?? 'Promo code created successfully');
      onSuccess?.();
    },
  });
}
