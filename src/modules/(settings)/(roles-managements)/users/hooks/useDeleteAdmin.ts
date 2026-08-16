import { deleteAdminApi } from '../services/admins.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteAdmin, isPending } = useMutation({
    mutationKey: ['admin'],
    mutationFn: (id: string) => deleteAdminApi(id),
    onSuccess: (res: any) => {
      const message = res?.message || 'Delete admin successfully';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
    // onError: (error: any) => {
    //     toast.error(error?.message || "Delete admin failed");
    // }
  });
  return { deleteAdmin, isLoading: isPending };
};
