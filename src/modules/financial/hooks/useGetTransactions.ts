import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../services/financial.service';
import { TRANSACTIONS_QUERY_KEY } from './financialData';
import type { ITransaction } from '../types';

function normalizeList(raw: unknown): ITransaction[] {
    if (Array.isArray(raw)) return raw as ITransaction[];
    if (raw && typeof raw === 'object') {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj['data'])) return obj['data'] as ITransaction[];
        if (Array.isArray(obj['result'])) return obj['result'] as ITransaction[];
    }
    return [];
}

export default function useGetTransactions() {
    return useQuery({
        queryKey: TRANSACTIONS_QUERY_KEY,
        queryFn: () => getTransactions(),
        select: (data) => normalizeList(data?.result ?? data),
    });
}
