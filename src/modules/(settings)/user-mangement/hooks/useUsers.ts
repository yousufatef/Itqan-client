import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getUsersListApi } from '../services/user.service';
import type { UsersListResponse } from '../types/user.types';
import useTableSearchParam from '@/hooks/useTableSearchParam';

const getNumberFilters = (values: string[]) =>
  values.map(Number).filter((value) => Number.isFinite(value));

export const useUsers = () => {
  const { pageNumber, pageSize, searchParams, searchValue, params } = useTableSearchParam();
  const sort = Number(params.sort ?? 0);
  const accountStatuses = getNumberFilters(searchParams.getAll('AccountStatuses'));
  const kycStatuses = getNumberFilters(searchParams.getAll('KycStatuses'));
  const joiningDaysAgoParam = searchParams.get('JoiningDaysAgo');
  const joiningDaysAgo = joiningDaysAgoParam ? Number(joiningDaysAgoParam) : undefined;
  const filters = {
    accountStatuses,
    kycStatuses,
    joiningDaysAgo:
      joiningDaysAgo !== undefined && Number.isFinite(joiningDaysAgo) ? joiningDaysAgo : undefined,
  };

  const { data, isLoading, isFetching, isPlaceholderData, error } = useQuery<UsersListResponse>({
    queryKey: ['user', pageNumber, pageSize, searchValue, sort, filters],
    queryFn: () => getUsersListApi(pageNumber, pageSize, searchValue, sort, 0, filters),
    placeholderData: keepPreviousData,
  });

  return {
    users: data?.data?.result,
    isLoading,
    isFetching,
    error,
    isPlaceholderData,
    totalCount: data?.data?.totalCount ?? 0,
  };
};
