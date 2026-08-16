import type { NewAdmin } from '@/modules/(settings)/(roles-managements)/users/types/admin.types';
import { updateAdminApi } from '../services/admins.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
type UseUpdateAdminOptions = {
  onSuccess?: () => void;
};

export const useUpdateAdmin = (options?: UseUpdateAdminOptions) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: updateAdmin, isPending } = useMutation({
    mutationKey: ['suspendAccount'],
    mutationFn: ({ id, data }: { id: string; data: NewAdmin }) => updateAdminApi(id, data),
    onSuccess: (res: any) => {
      const message = res?.message || 'Update admin successfully';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['adminsList'] });
      queryClient.invalidateQueries({ queryKey: ['admin'] });

      if (options?.onSuccess) {
        options.onSuccess();
        return;
      }

      navigate(-1);
    },
    // onError: (error: any) => {
    //     toast.error(error?.message || "Update admin failed");
    // }
  });
  return { updateAdmin, isLoading: isPending };
};
