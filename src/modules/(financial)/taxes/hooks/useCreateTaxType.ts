import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { createTaxType } from '../services/taxes.service';
import { FINANCIAL_TAXES_TYPE_QUERY_KEY } from '../constants/taxes.constants';

type UseCreateTaxTypeArgs = {
  onSuccess?: () => void;
};

export default function useCreateTaxType({ onSuccess }: UseCreateTaxTypeArgs) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaxType,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_TAXES_TYPE_QUERY_KEY] });
      toast.success(res?.message ?? 'Tax type created successfully');
      onSuccess?.();
    },
  });
}
