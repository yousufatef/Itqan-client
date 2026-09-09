import useTableSearchParam from '@/hooks/useTableSearchParam';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../services/users.service';

type UseGetUsersOptions = {
  searchValue?: string;
  role?: string;
};

export default function useGetUsers(options: UseGetUsersOptions = {}) {
  const { pageNumber, pageSize, searchValue, searchParams } = useTableSearchParam();
  const roleParam = options.role ?? searchParams.get('role') ?? '';
  const role = roleParam === 'all' ? '' : roleParam;
  const search = options.searchValue ?? searchValue;

  return useQuery({
    queryKey: ['users', pageNumber, pageSize, search, role],
    queryFn: () => getAllUsers(pageNumber, pageSize, search, role),
    placeholderData: keepPreviousData,
  });
}