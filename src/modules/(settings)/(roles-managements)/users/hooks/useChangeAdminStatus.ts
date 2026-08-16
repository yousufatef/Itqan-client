import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeAdminStatusApi } from '../services/admins.service';

export function useChangeAdminStatus(): {
  editAdminStatus: (data: { id: string; isActive: boolean }) => Promise<void>;
  isLoading: boolean;
} {
  const queryClient = useQueryClient();
  const { mutateAsync: editAdminStatus, isPending: isLoading } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      changeAdminStatusApi(id, isActive),

    onSuccess: (response:any) => {
      queryClient.invalidateQueries({ queryKey: ['admin'], exact: false });
      toast.success(response?.message);
    },
  });

  return { editAdminStatus, isLoading };
}