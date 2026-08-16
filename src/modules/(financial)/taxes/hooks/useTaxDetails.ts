import { useLanguageQuery } from '@/hooks/useLanguageQuery';
import { getTaxById } from '../services/taxes.service';
import { FINANCIAL_TAXES_QUERY_KEY } from '../constants/taxes.constants';

export default function useTaxDetails(taxId: string) {
  return useLanguageQuery({
    queryKey: [FINANCIAL_TAXES_QUERY_KEY, taxId],
    queryFn: () => getTaxById(taxId),
    enabled: !!taxId,
  });
}
