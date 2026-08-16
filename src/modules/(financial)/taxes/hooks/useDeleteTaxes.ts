import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { FINANCIAL_TAXES_QUERY_KEY } from '../constants/taxes.constants';
import { deleteTax } from '../services/taxes.service';
import { useTranslation } from 'react-i18next';

type UseDeleteTaxesOptions = {
  onSuccess?: () => void;
};

export default function useDeleteTaxes(options?: UseDeleteTaxesOptions) {
  const queryClient = useQueryClient();
const {t} = useTranslation()
  return useMutation({
    mutationFn: deleteTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_TAXES_QUERY_KEY] });
      toast.error(t("taxes.messages.successdelete"));
      options?.onSuccess?.();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
