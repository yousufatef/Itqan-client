import {
  getRoleDetails,
  ROLE_DETAILS_QUERY_KEY,
} from '@/modules/(settings)/(roles-managements)/roles/services/roles.service';
import useLanguageQuery from '@/hooks/useLanguageQuery';

export default function useRoleDetails(roleId: string) {
  const {
    data,
    isLoading: isLoadingRole,
    isFetched: isRoleFetched,
    error: roleError,
    refetch: refetchRole,
    isRefetching: isRefetchingRole,
  } = useLanguageQuery({
    queryKey: [ROLE_DETAILS_QUERY_KEY, roleId],
    queryFn: () => getRoleDetails(roleId),
    enabled: !!roleId,
  });

  return { data, isLoadingRole, isRoleFetched, roleError, refetchRole, isRefetchingRole };
}
