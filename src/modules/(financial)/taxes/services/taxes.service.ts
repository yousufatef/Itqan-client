import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type { ApiResponse } from '@/types/index.t';
import type { GetTaxesResponse, Tax, TaxesFinancialListItem } from '../types/taxes.types';
import type { GetTaxTypesResponse, TaxType } from '../types/taxes-types.type';

export interface CreateTaxPayload {
  nameEn: string;
  nameIt: string;
  rate: number;
  type: number;
  calculationType: number;
}

export interface UpdateTaxPayload extends CreateTaxPayload {
  id: string;
}

export interface UpdateTaxTypePayload {
  id: string;
  nameEn: string;
  nameIt: string;
}

export const TAXES_ENDPOINTS = {
  paginated: 'Taxes/paginated',
  byId: 'Taxes',
  create: 'Taxes',
  update: 'Taxes/update',
  deleteById: 'Taxes',
} as const;
export const TAXES_TYPES_ENDPOINTS = {
  paginated: 'TaxType/paginated',
  all: 'Taxes/tax-types',
  byId: 'TaxType',
  create: 'TaxType',
  update: 'TaxType/update',
  deleteById: 'TaxType',
} as const;

// -------------------- GET ALL TAXES ------------------------------------
export async function getTaxes(
  pageIndex = 1,
  pageSize = 10,
  searchValue = '',
): Promise<GetTaxesResponse> {
  return apiRequest(
    `${TAXES_ENDPOINTS.paginated}?${generateQueryParams({ searchValue, pageIndex, pageSize })}`,
  );
}

// -------------------- GET ALL TAXES TYPE ------------------------------------
export async function getTaxesType(
  pageIndex = 1,
  pageSize = 10,
  searchValue = '',
): Promise<GetTaxTypesResponse> {
  return apiRequest(
    `${TAXES_TYPES_ENDPOINTS.paginated}?${generateQueryParams({ searchValue, pageIndex, pageSize })}`,
  );
}



export async function getAllTaxesType(): Promise<ApiResponse<TaxType[]>> {
  return apiRequest(TAXES_TYPES_ENDPOINTS.all);
}

export async function getTaxTypeById(taxTypeId: string): Promise<ApiResponse<TaxType>> {
  return apiRequest(`${TAXES_TYPES_ENDPOINTS.byId}/${taxTypeId}`);
}

export async function getTaxById(taxId: string): Promise<ApiResponse<Tax>> {
  return apiRequest(`${TAXES_ENDPOINTS.byId}/${taxId}`);
}

export async function createTax(payload: CreateTaxPayload): Promise<unknown> {
  return apiRequest(TAXES_ENDPOINTS.create, { method: 'POST', body: payload });
}

export async function updateTax(payload: UpdateTaxPayload): Promise<unknown> {
  return apiRequest(TAXES_ENDPOINTS.update, { method: 'PUT', body: payload });
}

export async function deleteTax(taxId: string): Promise<unknown> {
  return apiRequest(`${TAXES_ENDPOINTS.deleteById}/${taxId}`, { method: 'DELETE' });
}

export async function createTaxType(payload: unknown): Promise<unknown> {
  return apiRequest(TAXES_TYPES_ENDPOINTS.create, { method: 'POST', body: payload });
}

export async function updateTaxType(payload: UpdateTaxTypePayload): Promise<unknown> {
  return apiRequest(TAXES_TYPES_ENDPOINTS.update, { method: 'PUT', body: payload });
}

export async function deleteTaxType(typeId: string): Promise<unknown> {
  return apiRequest(`${TAXES_TYPES_ENDPOINTS.deleteById}/${typeId}`, { method: 'DELETE' });
}

export type { TaxesFinancialListItem };
