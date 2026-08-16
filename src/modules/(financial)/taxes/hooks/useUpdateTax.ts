import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { updateTax, type UpdateTaxPayload } from '../services/taxes.service';
import { FINANCIAL_TAXES_QUERY_KEY } from '../constants/taxes.constants';
import { useTranslation } from 'react-i18next';

type UseUpdateTaxArgs = {
  onSuccess?: () => void;
};

export default function useUpdateTax({ onSuccess }: UseUpdateTaxArgs) {
  const queryClient = useQueryClient();
const {t} = useTranslation()
  return useMutation<unknown, Error, UpdateTaxPayload>({
    mutationFn: updateTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_TAXES_QUERY_KEY] });
      toast.success(t("taxes.messages.successUpdate") );
      onSuccess?.();
    },
  });
}
