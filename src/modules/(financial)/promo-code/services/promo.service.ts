import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type { GetPromoCodesResponse } from '../types/promo.types';

export interface CreatePromoCodePayload {
  codeNameEn: string;
  codeNameIt: string;
  discountType: number;
  discountValue: number;
  code: string;
  maxUsesPerUser: number;
  startDate: string;
  endDate: string;
}

export interface UpdatePromoCodePayload extends CreatePromoCodePayload {
  id: string;
}

export const PROMO_ENDPOINTS = {
  paginated: 'PromoCodes/paginated',
  create: 'PromoCodes/create',
  update: 'PromoCodes/update',
  deleteById: 'PromoCodes',
} as const;

// -------------------- GET ALL PROMO CODES ------------------------------------
export async function getPromoCodes(
  pageIndex = 1,
  pageSize = 10,
  searchTerm = '',
): Promise<GetPromoCodesResponse> {
  return apiRequest(
    `${PROMO_ENDPOINTS.paginated}?${generateQueryParams({ searchTerm, pageIndex, pageSize })}`,
  );
}

export async function createPromoCode(payload: CreatePromoCodePayload): Promise<unknown> {
  return apiRequest(PROMO_ENDPOINTS.create, { method: 'POST', body: payload });
}

export async function updatePromoCode({
  id,
  ...payload
}: UpdatePromoCodePayload): Promise<unknown> {
  return apiRequest(`${PROMO_ENDPOINTS.update}/${id}`, { method: 'PUT', body: payload });
}

export async function deletePromoCode(promoId: string): Promise<unknown> {
  return apiRequest(`${PROMO_ENDPOINTS.deleteById}/${promoId}`, { method: 'DELETE' });
}
