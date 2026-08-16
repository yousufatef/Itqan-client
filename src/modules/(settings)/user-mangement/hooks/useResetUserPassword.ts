import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import type { ApiResponse } from '@/types/index.t';
import { resetUserPasswordApi } from '../services/user.service';

export default function useResetUserPassword(onSuccess?: () => void) {
  const { mutateAsync: resetPassword, isPending: isResettingPassword } = useMutation({
    mutationFn: resetUserPasswordApi,
    onSuccess: (res: ApiResponse<null>) => {
      toast.success(res.message);
      onSuccess?.();
    },
  });

  return { resetPassword, isResettingPassword };
}
