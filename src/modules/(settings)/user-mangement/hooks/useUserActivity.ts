import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getUserActivityDetailsApi } from '../services/user.service';
import type { UserActivityData } from '../types/user.types';

export const USER_ACTIVITY_PAGE_SIZE = 5;

export const useUserActivity = (userId: string, pageSize = USER_ACTIVITY_PAGE_SIZE) => {
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useQuery<UserActivityData>({
      queryKey: ['user-activity', userId, pageSize],
      queryFn: () => getUserActivityDetailsApi(userId, 1, pageSize),
      enabled: Boolean(userId),
      placeholderData: keepPreviousData,
    });

  return {
    activities: data?.activities ?? [],
    totalCount: data?.totalCount ?? 0,
    lastActive: data?.lastActive ?? null,
    isLoading,
    isFetching,
    error,
    refetch,
    isPlaceholderData,
  };
};
