import { getTaxes } from '../services/taxes.service';
import { FINANCIAL_TAXES_QUERY_KEY } from '../constants/taxes.constants';
import useLanguageQuery from '@/hooks/useLanguageQuery';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import { keepPreviousData } from '@tanstack/react-query';

export default function useAllTaxes() {
  const { searchValue, pageNumber, pageSize } = useTableSearchParam();

  return useLanguageQuery({
    queryKey: [FINANCIAL_TAXES_QUERY_KEY, searchValue, pageNumber, pageSize],
    queryFn: () => getTaxes(pageNumber, pageSize, searchValue),
    placeholderData: keepPreviousData,
  });
}
