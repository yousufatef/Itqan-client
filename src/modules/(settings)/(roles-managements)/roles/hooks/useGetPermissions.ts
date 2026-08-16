import {
  getAllPermissions,
  PERMISSIONS_QUERY_KEY,
} from '@/modules/(settings)/(roles-managements)/roles/services/roles.service';
import useLanguageQuery from '@/hooks/useLanguageQuery';

export default function useGetPermissions(options?: { roleId?: string; enabled?: boolean }) {
  const roleId = options?.roleId;
  const enabled = options?.enabled ?? !roleId;

  const {
    data: permissionsRes,
    isLoading: isLoadingPermissions,
    isFetched: isPermissionsFetched,
    error: permissionError,
    refetch: refetchPermissions,
    isRefetching: isRefetchingPermissions,
  } = useLanguageQuery({
    queryKey: [PERMISSIONS_QUERY_KEY],
    queryFn: () => getAllPermissions(),
    enabled,
  });

  return {
    permissionsRes,
    isLoadingPermissions,
    isPermissionsFetched,
    permissionError,
    refetchPermissions,
    isRefetchingPermissions,
  };
}
