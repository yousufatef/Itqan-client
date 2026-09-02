import useTableSearchParam from '@/hooks/useTableSearchParam';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../services/users.service';

export default function useGetUsers() {
  const { pageNumber, pageSize, searchValue, searchParams } = useTableSearchParam();
  const roleParam = searchParams.get('role') ?? '';
  const role = roleParam === 'all' ? '' : roleParam;

  return useQuery({
    queryKey: ['users', pageNumber, pageSize, searchValue, role],
    queryFn: () => getAllUsers(pageNumber, pageSize, searchValue, role),
    placeholderData: keepPreviousData,
  });
}