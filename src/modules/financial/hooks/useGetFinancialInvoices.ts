import { useQuery } from '@tanstack/react-query';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import { financialInvoices, FINANCIAL_QUERY_KEY } from './financialData';

export default function useGetFinancialInvoices() {
    const { searchValue } = useTableSearchParam();

    return useQuery({
        queryKey: [...FINANCIAL_QUERY_KEY, searchValue],
        queryFn: async () => {
            const normalizedSearch = searchValue.trim().toLowerCase();
            const data = financialInvoices.filter((invoice) =>
                normalizedSearch
                    ? [invoice.id, invoice.studentName].some((value) =>
                        value.toLowerCase().includes(normalizedSearch),
                    )
                    : true,
            );

            return { result: { data, totalCount: data.length } };
        },
    });
}
