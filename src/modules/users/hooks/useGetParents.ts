import { useQuery } from '@tanstack/react-query';
import { getParentsDropdown } from '../services/users.service';

export default function useGetParents() {
  return useQuery({
    queryKey: ['users', 'dropdown', 'parent'],
    queryFn: getParentsDropdown,
  });
}