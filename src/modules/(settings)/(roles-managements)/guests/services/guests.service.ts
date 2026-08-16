import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type { ListApiResponse } from '@/types/index.t';

export const SETTINGS_GUESTS_QUERY_KEY = 'settings-guests-list';

export const SETTINGS_GUESTS_ENDPOINTS = {
  all: 'Guests/Guests',
  pagination: 'Guests/GuestsPagination',
  create: 'Guests/createGuest',
  edit: 'Guests/editGuest',
  delete: 'Guests/deleteGuest',
} as const;

export type SettingsGuestApi = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  mobile?: string;
  createdOn?: string;
};

export async function getAllSettingsGuests(): Promise<SettingsGuestApi[]> {
  const response = await apiRequest<ListApiResponse<SettingsGuestApi[]> | SettingsGuestApi[]>(
    SETTINGS_GUESTS_ENDPOINTS.all,
    { method: 'GET' },
  );

  if (Array.isArray(response)) return response;
  return response.result ?? [];
}

export async function getSettingsGuests(params: {
  searchValue?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<ListApiResponse<SettingsGuestApi[]>> {
  const response = await apiRequest<ListApiResponse<SettingsGuestApi[]> | SettingsGuestApi[]>(
    `${SETTINGS_GUESTS_ENDPOINTS.pagination}?${generateQueryParams({
      searchValue: params.searchValue ?? '',
      pageIndex: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 10,
    })}`,
  );

  if (Array.isArray(response)) {
    return {
      result: response,
      totalCount: response.length,
      message: null,
      errors: null,
      statusCode: 200,
    };
  }

  return response;
}

export async function deleteSettingsGuest(guestId: string): Promise<unknown> {
  return apiRequest(`${SETTINGS_GUESTS_ENDPOINTS.delete}?${generateQueryParams({ id: guestId })}`, {
    method: 'DELETE',
  });
}
