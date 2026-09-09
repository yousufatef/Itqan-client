import { apiRequest } from '@/utils/api';
import type { ICategory, CategoryPayload, ITransaction, TransactionPayload } from '../types';

export const FINANCIAL_ENDPOINTS = {
    categories: 'financial/categories',
    transactions: 'financial/transactions',
} as const;

// ── Categories ───────────────────────────────────────────────────────────────

export type CategoriesResponse = {
    result: ICategory[];
};

export function getCategories(): Promise<CategoriesResponse> {
    return apiRequest<CategoriesResponse>(FINANCIAL_ENDPOINTS.categories);
}

export function createCategory(payload: CategoryPayload): Promise<unknown> {
    return apiRequest(FINANCIAL_ENDPOINTS.categories, {
        method: 'POST',
        body: payload,
    });
}

export function updateCategory(id: number, payload: CategoryPayload): Promise<unknown> {
    return apiRequest(`${FINANCIAL_ENDPOINTS.categories}/${id}`, {
        method: 'PATCH',
        body: payload,
    });
}

export function deleteCategory(id: number): Promise<unknown> {
    return apiRequest(`${FINANCIAL_ENDPOINTS.categories}/${id}`, {
        method: 'DELETE',
    });
}

// ── Transactions ─────────────────────────────────────────────────────────────

export type TransactionsResponse = {
    result: ITransaction[];
};

export function getTransactions(): Promise<TransactionsResponse> {
    return apiRequest<TransactionsResponse>(FINANCIAL_ENDPOINTS.transactions);
}

export function createTransaction(payload: TransactionPayload): Promise<unknown> {
    return apiRequest(FINANCIAL_ENDPOINTS.transactions, {
        method: 'POST',
        body: payload,
    });
}

export function updateTransaction(id: number, payload: TransactionPayload): Promise<unknown> {
    return apiRequest(`${FINANCIAL_ENDPOINTS.transactions}/${id}`, {
        method: 'PATCH',
        body: payload,
    });
}

export function deleteTransaction(id: number): Promise<unknown> {
    return apiRequest(`${FINANCIAL_ENDPOINTS.transactions}/${id}`, {
        method: 'DELETE',
    });
}
