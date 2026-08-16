import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import {
  ROLE_DETAILS_QUERY_KEY,
  updateRoleApi,
} from '@/modules/(settings)/(roles-managements)/roles/services/roles.service';
import type { ApiResponse } from '@/types/index.t';
import type {
  Role,
  RolePayload,
} from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ROLES_LIST_QUERY_KEY } from '@/modules/(settings)/(roles-managements)/roles/services/roles.service';

type UseUpdateRoleOptions = {
  onSuccess?: () => void;
};

export default function useUpdateRole(roleId: string, options?: UseUpdateRoleOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: updateRole, isPending: isUpdatingRole } = useMutation({
    mutationFn: (role: RolePayload) => updateRoleApi(roleId, role),
    onSuccess: (res: ApiResponse<Role>) => {
      queryClient.invalidateQueries({
        queryKey: [ROLES_LIST_QUERY_KEY],
      });

      queryClient.invalidateQueries({
        queryKey: [ROLE_DETAILS_QUERY_KEY, roleId],
      });

      toast.success(res.message);

      if (options?.onSuccess) {
        options.onSuccess();
        return;
      }

      navigate('/settings/roles');
    },
  });
  return { updateRole, isUpdatingRole };
}
