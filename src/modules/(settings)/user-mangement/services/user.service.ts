import type { ApiResponse } from '@/types/index.t';
import type {
  LastLoginResponse,
  UserActivityData,
  UserActivityResponse,
  UsersListFilters,
  UsersListResponse,
} from '../types/user.types';
import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';

export async function getUsersListApi(
  pageNumber = 1,
  pageSize = 10,
  searchTerm = '',
  SortBy = 0,
  SortOrder = 0,
  filters: UsersListFilters = {},
): Promise<UsersListResponse> {
  return apiRequest<UsersListResponse>(
    `identity/admin/users?${generateQueryParams({
      pageNumber,
      pageSize,
      searchTerm,
      SortBy,
      SortOrder,
      AccountStatuses: filters.accountStatuses,
      KycStatuses: filters.kycStatuses,
      JoiningDaysAgo: filters.joiningDaysAgo,
    })}`,
    { method: 'GET' },
  );
}

export async function getLastLoginApi(userId: string): Promise<LastLoginResponse> {
  return apiRequest<LastLoginResponse>(`audit/admin/users/${userId}/last-active`, {
    method: 'GET',
  });
}

export async function getUserActivityApi(
  userId: string,
  page = 1,
  pageSize = 5,
): Promise<UserActivityResponse> {
  return apiRequest<UserActivityResponse>(
    `audit/admin/users/${userId}/activities?${generateQueryParams({ Page: page, PageSize: pageSize })}`,
    { method: 'GET' },
  );
}

export async function getUserActivityDetailsApi(
  userId: string,
  page = 1,
  pageSize = 5,
): Promise<UserActivityData> {
  const [activitiesResponse, lastLoginResponse] = await Promise.all([
    getUserActivityApi(userId, page, pageSize),
    getLastLoginApi(userId),
  ]);
  const activityData = activitiesResponse.data;

  return {
    activities: activityData?.result ?? [],
    totalCount: activityData?.totalCount ?? 0,
    pageSize: activityData?.pageSize ?? pageSize,
    pageNumber: activityData?.pageNumber ?? page,
    lastActive: lastLoginResponse.data ?? null,
  };
}

export async function resetUserPasswordApi({
  userId,
  note,
}: {
  userId: string;
  note?: string;
}): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>(`identity/admin/users/${userId}/reset-password`, {
    method: 'POST',
    body: note ? { note } : undefined,
  });
}
