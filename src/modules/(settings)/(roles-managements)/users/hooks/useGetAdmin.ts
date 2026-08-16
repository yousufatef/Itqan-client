import { getAdminApi } from '../services/admins.service';
import { useQuery } from '@tanstack/react-query';

export const useAdmin = (id: string, enabled = true) => {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['admin', id],
    queryFn: () => getAdminApi(id),
    enabled: enabled && !!id,
  });

  return { adminData: data?.data ?? data?.result, isLoading, error };
};
