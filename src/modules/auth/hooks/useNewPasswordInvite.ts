import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { ResetAdminPasswordParams } from '../types/auth.types';
import { setPasswordInviteApi } from '../service/auth.service';

export function useSetPasswordInvite() {
  const navigate = useNavigate();

  const { mutateAsync: setPasswordInvite, isPending: isLoading } = useMutation<
    unknown,
    Error,
    ResetAdminPasswordParams
  >({
    mutationFn: setPasswordInviteApi,
    onSuccess: () => {
      void navigate('/password-changed', { replace: true });
    },
  });

  return { setPasswordInvite, isLoading };
}
