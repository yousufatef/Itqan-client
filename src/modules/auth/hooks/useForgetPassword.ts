import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

import { forgetPasswordApi } from '@/modules/auth/service/auth.service';
import { toast } from 'sonner';
// import { useTranslation } from 'react-i18next';
export function useForgetPassword() {
  const navigate = useNavigate();
  // const { t } = useTranslation();
  const { mutateAsync: forgetPassword, isPending: isLoading } = useMutation({
    mutationFn: forgetPasswordApi,
    onSuccess: (response: any, variables) => {
      toast.success(response.message);

      const query = new URLSearchParams({
        email: variables.email,
      });

      void navigate(`/verify-email?${query.toString()}`);
    },

    // onError: (error: Error) => {
    //   const errorMessage = error.message || t('errors.unexpectedHint');
    //   toast.error(errorMessage);
    // },
  });

  return { forgetPassword, isLoading };
}
