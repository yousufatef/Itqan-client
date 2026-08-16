import Cookies from 'js-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { REFRESH_TOKEN, TOKEN, USER_VERIFIED } from '@/constants';
import type { LoginParams, LoginResponse } from '@/modules/auth/types/auth.types';
import { loginApi } from '@/modules/auth/service/auth.service';
// import { toast } from 'sonner';

function safeCallbackUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  return null;
}

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'));

  const cookieBase = {
    path: '/',
    sameSite: 'lax' as const,
    secure: import.meta.env.PROD,
  };

  const { mutateAsync: login, isPending: isLoading } = useMutation<
    LoginResponse,
    Error,
    LoginParams
  >({
    mutationFn: loginApi,
    onSuccess: (user) => {
      if (user.token) {
        Cookies.set(TOKEN, user.token, {
          ...cookieBase,
          expires: user.expiresOn ? new Date(user.expiresOn) : undefined,
        });
      }

      if (user.refreshToken) {
        Cookies.set(REFRESH_TOKEN, user.refreshToken, {
          ...cookieBase,
          expires: user.refreshTokenExpiration
            ? new Date(user.refreshTokenExpiration)
            : undefined,
        });
      }

      Cookies.set(USER_VERIFIED, String(true), {
        ...cookieBase,
        expires: user.expiresOn ? new Date(user.expiresOn) : undefined,
      });

      queryClient.removeQueries();

      const redirectTo = callbackUrl || '/';
      void navigate(redirectTo, { replace: true });
    },
    // onError: (error: Error) => {
    //   const errorMessage = error.message;
    //   toast.error(errorMessage);
    // },
  });

  return { login, isLoading };
}
