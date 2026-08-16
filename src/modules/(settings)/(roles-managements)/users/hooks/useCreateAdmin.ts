import type { NewAdmin } from '@/modules/(settings)/(roles-managements)/users/types/admin.types';
import { createAdminApi } from '../services/admins.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type UseCreateAdminOptions = {
  onSuccess?: () => void;
};

export const useCreateAdmin = (options?: UseCreateAdminOptions) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: createAdmin, isPending } = useMutation({
    mutationKey: ['admin'],
    mutationFn: (data: NewAdmin) => createAdminApi(data),
    onSuccess: (res: any) => {
      const message = res?.message || 'Create admin successfully';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['admin'] });

      if (options?.onSuccess) {
        options.onSuccess();
        return;
      }

      navigate(-1);
    },
  });
  return { createAdmin, isLoading: isPending };
};
