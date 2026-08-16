import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type { CitiesSettingsListItem } from '../types/cities.types';

export const CITIES_ENDPOINTS = {
  paginated: 'Cities/citiesPagination',
  all: 'Cities/allCities',
  create: 'Cities/createCity',
  update: 'Cities/editCity',
  delete: 'Cities/deleteCity',
} as const;

export async function getCities(
  pageIndex = 1,
  pageSize = 10,
  searchValue = '',
): Promise<unknown> {
  return apiRequest(
    `${CITIES_ENDPOINTS.paginated}?${generateQueryParams({ searchValue, pageSize, pageIndex })}`,
  );
}

export async function getAllCities(): Promise<unknown> {
  return apiRequest(CITIES_ENDPOINTS.all);
}

export async function createCity(payload: unknown): Promise<unknown> {
  return apiRequest(CITIES_ENDPOINTS.create, { method: 'POST', body: payload });
}

export async function updateCity(payload: unknown): Promise<unknown> {
  return apiRequest(CITIES_ENDPOINTS.update, { method: 'PUT', body: payload });
}

export async function deleteCity(cityId: string): Promise<unknown> {
  return apiRequest(`${CITIES_ENDPOINTS.delete}?${generateQueryParams({ cityId })}`, {
    method: 'DELETE',
  });
}

export type { CitiesSettingsListItem };
