import { getPromoCodes } from '../services/promo.service';
import { FINANCIAL_PROMO_QUERY_KEY } from '../constants/promo.constants';
import useLanguageQuery from '@/hooks/useLanguageQuery';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import { keepPreviousData } from '@tanstack/react-query';

export default function usePromoCodes() {
  const { searchValue : searchTerm, pageNumber, pageSize } = useTableSearchParam();

  return useLanguageQuery({
    queryKey: [FINANCIAL_PROMO_QUERY_KEY, searchTerm, pageNumber, pageSize],
    queryFn: () => getPromoCodes(pageNumber, pageSize, searchTerm),
    placeholderData: keepPreviousData,
  });
}
