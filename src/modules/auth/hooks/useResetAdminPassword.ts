import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { ResetForgotPasswordParams } from '../types/auth.types';
import { resetAdminPasswordApi } from '../service/auth.service';
import { FORGOT_PASSWORD_OTP_KEY } from './useOtp';

export function useResetAdminPassword() {
  const navigate = useNavigate();

  const { mutateAsync: resetAdminPassword, isPending: isLoading } = useMutation<
    unknown,
    Error,
    ResetForgotPasswordParams
  >({
    mutationFn: resetAdminPasswordApi,
    onSuccess: () => {
      sessionStorage.removeItem(FORGOT_PASSWORD_OTP_KEY);
      void navigate('/password-changed', { replace: true });
    },
  });

  return { resetAdminPassword, isLoading };
}
