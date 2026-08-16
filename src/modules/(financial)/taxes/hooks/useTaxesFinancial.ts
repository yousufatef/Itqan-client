import { FINANCIAL_TAXES_QUERY_KEY } from '../constants/taxes.constants';

export const useTaxesFinancial = () => {
  return {
    queryKey: FINANCIAL_TAXES_QUERY_KEY,
  };
};
