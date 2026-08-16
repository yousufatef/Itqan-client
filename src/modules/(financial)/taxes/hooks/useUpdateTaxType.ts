import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { updateTaxType, type UpdateTaxTypePayload } from '../services/taxes.service';
import { FINANCIAL_TAXES_TYPE_QUERY_KEY } from '../constants/taxes.constants';

type UseUpdateTaxTypeArgs = {
  onSuccess?: () => void;
};

export default function useUpdateTaxType({ onSuccess }: UseUpdateTaxTypeArgs) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateTaxTypePayload>({
    mutationFn: updateTaxType,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_TAXES_TYPE_QUERY_KEY] });
      toast.success(res?.message ?? 'Tax type updated successfully');
      onSuccess?.();
    },
  });
}
