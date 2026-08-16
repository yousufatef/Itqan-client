import { useLanguageQuery } from '@/hooks/useLanguageQuery';
import { FINANCIAL_PROMO_QUERY_KEY } from '../constants/promo.constants';

// This hook is kept for backward compatibility but is no longer used
// Data is now passed directly from the table to the form
export default function useTaxDetails(_taxId: string) {
  return useLanguageQuery({
    queryKey: [FINANCIAL_PROMO_QUERY_KEY, _taxId],
    queryFn: () => Promise.resolve({ result: null }),
    enabled: false,
  });
}
