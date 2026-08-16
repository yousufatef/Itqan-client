import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { createTax, type CreateTaxPayload } from '../services/taxes.service';
import { FINANCIAL_TAXES_QUERY_KEY } from '../constants/taxes.constants';
import { useTranslation } from 'react-i18next';

type UseCreateTaxArgs = {
  onSuccess?: () => void;
};

export default function useCreateTax({ onSuccess }: UseCreateTaxArgs) {
  const queryClient = useQueryClient();
const {t} = useTranslation()
  return useMutation<unknown, Error, CreateTaxPayload>({
    mutationFn: createTax,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FINANCIAL_TAXES_QUERY_KEY] });
      toast.success( t('taxes.messages.successCreate'));
      onSuccess?.();
    },
  });
}
