import useTableSearchParam from '@/hooks/useTableSearchParam';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../services/users.service';

export default function useGetUsers() {
  const { pageNumber, pageSize, searchValue } = useTableSearchParam();

  return useQuery({
    queryKey: ['users', pageNumber, pageSize, searchValue],
    queryFn: () => getAllUsers(pageNumber, pageSize, searchValue),
    placeholderData: keepPreviousData,
  });
}