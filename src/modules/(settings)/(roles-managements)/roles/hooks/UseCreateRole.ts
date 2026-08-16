import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import {
  addRoleApi,
  ROLES_LIST_QUERY_KEY,
} from '@/modules/(settings)/(roles-managements)/roles/services/roles.service';
import type { ApiResponse } from '@/types/index.t';
import type { Role } from '@/modules/(settings)/(roles-managements)/roles/types/permissions-types';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

type UseCreateRoleOptions = {
  onSuccess?: () => void;
};

export default function UseCreateRole(options?: UseCreateRoleOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: addRole, isPending: isAddingRole } = useMutation({
    mutationFn: addRoleApi,
    onSuccess: (res: ApiResponse<Role>) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_LIST_QUERY_KEY] });
      toast.success(res.message);

      if (options?.onSuccess) {
        options.onSuccess();
        return;
      }

      navigate('/settings/roles');
    },
  });

  return { addRole, isAddingRole };
}
