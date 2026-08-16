import { useQuery } from '@tanstack/react-query';
import { getAdminRolesPermissionsListApi } from '../services/admins.service';

export const useGetAdminRolesPermissions = (enabled = true) => {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ['adminRoles'],
    queryFn: () => getAdminRolesPermissionsListApi(),
    enabled,
  });

  return { adminData: data?.data, isLoading, error };
};

