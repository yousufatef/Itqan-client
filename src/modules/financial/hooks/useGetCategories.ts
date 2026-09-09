import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/financial.service';
import { CATEGORIES_QUERY_KEY } from './financialData';
import type { ICategory } from '../types';

function normalizeList(raw: unknown): ICategory[] {
    if (Array.isArray(raw)) return raw as ICategory[];
    if (raw && typeof raw === 'object') {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj['data'])) return obj['data'] as ICategory[];
        if (Array.isArray(obj['result'])) return obj['result'] as ICategory[];
    }
    return [];
}

export default function useGetCategories() {
    return useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: () => getCategories(),
        select: (data) => normalizeList(data?.result ?? data),
    });
}
