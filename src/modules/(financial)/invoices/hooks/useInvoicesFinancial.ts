import { FINANCIAL_INVOICES_QUERY_KEY } from '../constants/invoices.constants';

export const useInvoicesFinancial = () => {
  return {
    queryKey: FINANCIAL_INVOICES_QUERY_KEY,
  };
};
