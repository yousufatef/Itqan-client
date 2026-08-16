import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeAuthCookies } from '@/utils/cookies';
import { logOutApi } from '@/modules/auth/service/auth.service';
// import { useTranslation } from 'react-i18next';

export function useLogoutApi() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const { t } = useTranslation();

  const { mutateAsync: logOut, isPending: isLoading } = useMutation({
    mutationFn: logOutApi,
    onSettled: () => {
      removeAuthCookies();
      queryClient.removeQueries();
      void navigate('/login', { replace: true });
    },
    // onError: (error: Error) => {
    //   const errorMsg = error.message;
    //   toast.error(errorMsg);
    // },
  });

  return { logOut, isLoading };
}
