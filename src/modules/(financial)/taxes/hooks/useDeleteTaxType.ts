import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { deleteTaxType } from '../services/taxes.service';
import { FINANCIAL_TAXES_TYPE_QUERY_KEY } from '../constants/taxes.constants';

type UseDeleteTaxTypeArgs = {
  onSuccess?: () => void;
};

export default function useDeleteTaxType({ onSuccess }: UseDeleteTaxTypeArgs) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaxType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_TAXES_TYPE_QUERY_KEY] });
      onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
