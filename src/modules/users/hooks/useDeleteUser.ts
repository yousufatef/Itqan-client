import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { deleteUser } from '../services/users.service';

type UseDeleteUserArgs = {
  onSuccess?: () => void;
};

export default function useDeleteUser({ onSuccess }: UseDeleteUserArgs = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (res: any) => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(res?.message || "تم حذف المستخدم بنجاح");
    },
  });
}
