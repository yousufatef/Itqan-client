import { useLanguageQuery } from '@/hooks/useLanguageQuery';
import { getTaxTypeById } from '../services/taxes.service';
import { FINANCIAL_TAXES_TYPE_QUERY_KEY } from '../constants/taxes.constants';

export default function useTaxTypeDetails(taxTypeId: string) {
  return useLanguageQuery({
    queryKey: [FINANCIAL_TAXES_TYPE_QUERY_KEY, taxTypeId],
    queryFn: () => getTaxTypeById(taxTypeId),
    enabled: !!taxTypeId,
  });
}
