import { FINANCIAL_PROMO_QUERY_KEY } from '../constants/promo.constants';

export const useTaxesFinancial = () => {
  return {
    queryKey: FINANCIAL_PROMO_QUERY_KEY,
  };
};
