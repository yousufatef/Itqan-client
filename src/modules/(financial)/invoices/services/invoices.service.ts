import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type { InvoicesFinancialListItem } from '../types/invoices.types';

export const INVOICES_ENDPOINTS = {
  paginatedByBooking: 'Invoices/paginated-by-booking',
  byBookingId: 'Invoices',
} as const;

export async function getInvoices(
  pageNumber = 1,
  pageSize = 10,
  searchTerm = '',
  apartmentIds: string[] = [],
  invoiceDate?: string,
): Promise<unknown> {
  return apiRequest(
    `${INVOICES_ENDPOINTS.paginatedByBooking}?${generateQueryParams({
      searchTerm,
      pageSize,
      pageNumber,
      apartmentIds,
      invoiceDate,
    })}`,
  );
}

export async function getInvoiceByBookingId(bookingId: string): Promise<unknown> {
  return apiRequest(`${INVOICES_ENDPOINTS.byBookingId}?${generateQueryParams({ bookingId })}`);
}

export type { InvoicesFinancialListItem };
