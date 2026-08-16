import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { FINANCIAL_TAXES_QUERY_KEY } from '../constants/taxes.constants';
import { deleteTaxType } from '../services/taxes.service';

type UseDeleteTaxesOptions = {
  onSuccess?: () => void;
};

export default function useDeleteTaxesType(options?: UseDeleteTaxesOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaxType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_TAXES_QUERY_KEY] });
      options?.onSuccess?.();
    },
    onError: (error : Error) => {
      toast.error(error.message);
    },
  });
}
