import { toast } from 'sonner';

import { useMutation } from '@tanstack/react-query';
import { resendOtpApi } from '@/modules/auth/service/auth.service';
// import { useTranslation } from 'react-i18next';

export function useResendOtp() {
  // const { t } = useTranslation();
  const { mutateAsync: resend, isPending: isLoading } = useMutation({
    mutationFn: resendOtpApi,
    onSuccess: (response: any) => {
      toast.success(response.message);
    },

    // onError: (error: Error) => {
    //   const errorMessage = error.message || t('errors.unexpectedHint');
    //   toast.error(errorMessage);
    // },
  });

  return { resend, isLoading };
}
