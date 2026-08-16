import { useQuery } from '@tanstack/react-query';
import { getAllTaxesType } from '../services/taxes.service';
import { FINANCIAL_TAXES_ALL_TYPES_QUERY_KEY } from '../constants/taxes.constants';

export default function useAllTaxesTypeAll() {
  return useQuery({
    queryKey: [FINANCIAL_TAXES_ALL_TYPES_QUERY_KEY],
    queryFn: getAllTaxesType,
  });
}
