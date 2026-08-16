import { getAdminsListApi } from '../services/admins.service';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useTableSearchParam from '@/hooks/useTableSearchParam';
type AdminResponse = {
  admins: any[];
  isLoading: boolean;
  isFetching?: boolean;
  error: unknown;
  isPlaceholderData: boolean;
  totalCount: number;
};

const normalize = (v: string | string[] | undefined): string => {
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
};

export const useAdminsList = (): AdminResponse => {
  const { pageNumber, pageSize, searchValue, params } = useTableSearchParam();

  const sort = Number(params.sort ?? 0);
  const status = String(params.status ?? '');

  const { data, isLoading, isFetching, isPlaceholderData, error } = useQuery<any>({
    queryKey: ['admin', pageNumber, pageSize, searchValue, sort, status],
    queryFn: () => getAdminsListApi(pageNumber, pageSize, normalize(searchValue), sort, status),
    placeholderData: keepPreviousData,
  });

  return {
    admins: data?.data?.result,
    isLoading,
    isFetching,
    error,
    isPlaceholderData,
    totalCount: data?.data?.totalCount,
  };
};
