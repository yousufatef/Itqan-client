import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { removeAuthCookies } from '@/utils/cookies';
import { changePasswordApi } from '@/modules/auth/service/auth.service';

export function useChangePassword() {
  const navigate = useNavigate();

  const { mutateAsync: changePassword, isPending: isLoading } = useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      removeAuthCookies();
      void navigate('/password-changed', { replace: true });
    },
  });

  return { changePassword, isLoading };
}
