import { FINANCIAL_TAXES_TYPE_QUERY_KEY } from '../constants/taxes.constants';
import useLanguageQuery from '@/hooks/useLanguageQuery';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import { keepPreviousData } from '@tanstack/react-query';
import { getTaxesType } from '../services/taxes.service';

export default function useAllTaxestype() {
  const { searchValue, pageNumber, pageSize } = useTableSearchParam();

  return useLanguageQuery({
    queryKey: [FINANCIAL_TAXES_TYPE_QUERY_KEY, searchValue, pageNumber, pageSize],
    queryFn: () => getTaxesType(pageNumber, pageSize, searchValue),
    placeholderData: keepPreviousData,
  });
}
