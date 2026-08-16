import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type { HowToUseAppsResponse, HowToUseAppByIdResponse } from '../types/smart-guide.types';

export const SMART_GUIDE_ENDPOINTS = {
  paginated: 'HowToUseApp/how-to-use-apps/paged',
  create: 'HowToUseApp/how-to-use-apps',
  update: 'HowToUseApp/how-to-use-apps',
  deleteById: 'HowToUseApp/how-to-use-apps',
  getById: 'HowToUseApp/how-to-use-apps',
} as const;

// -------------------- GET SMART GUIDES ------------------------------------
export async function getSmartGuides(
  pageNumber = 1,
  pageSize = 10,
  searchTerm = '',
): Promise<HowToUseAppsResponse> {
  return apiRequest(
    `${SMART_GUIDE_ENDPOINTS.paginated}?${generateQueryParams({ searchTerm,  pageNumber, pageSize })}`,
  );
}

// -------------------- GET SMART GUIDE BY ID ------------------------------------
export async function getSmartGuideById(id: string): Promise<HowToUseAppByIdResponse> {
  return apiRequest(`${SMART_GUIDE_ENDPOINTS.getById}/${id}`);
}

// -------------------- CREATE SMART GUIDE ------------------------------------
export async function createSmartGuide(payload: FormData): Promise<unknown> {
  return apiRequest(SMART_GUIDE_ENDPOINTS.create, { method: 'POST', body: payload });
}

// -------------------- UPDATE SMART GUIDE ------------------------------------
export async function updateSmartGuide(payload: FormData): Promise<unknown> {
  return apiRequest(SMART_GUIDE_ENDPOINTS.update, { method: 'PUT', body: payload });
}

// -------------------- DELETE SMART GUIDE ------------------------------------
export async function deleteSmartGuide(id: string): Promise<unknown> {
  return apiRequest(`${SMART_GUIDE_ENDPOINTS.deleteById}/${id}`, { method: 'DELETE' });
}
