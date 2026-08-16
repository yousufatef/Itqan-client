import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { otpApi } from '@/modules/auth/service/auth.service';
import type { OtpParams } from '@/modules/auth/types/auth.types';
import { toast } from 'sonner';

export const FORGOT_PASSWORD_OTP_KEY = 'forgotPasswordOtp';

export function useOtp() {
  const navigate = useNavigate();
  const { mutateAsync: otp, isPending: isLoading } = useMutation({
    mutationFn: otpApi,
    onSuccess: (res, variables: OtpParams) => {
      sessionStorage.setItem(FORGOT_PASSWORD_OTP_KEY, variables.otp);

      const query = new URLSearchParams({ email: variables.email });
      toast.success(res?.message ?? undefined);
      void navigate(`/new-password?${query.toString()}`);
    },
  });

  return { otp, isLoading };
}
