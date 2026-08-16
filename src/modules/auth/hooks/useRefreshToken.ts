import Cookies from 'js-cookie';

import { useQuery } from '@tanstack/react-query';

import { REFRESH_TOKEN, TOKEN } from '@/constants';

import type { RefreshTokenResponse } from '@/types/auth.types';
import { refreshTokenApi } from '@/modules/auth/service/auth.service';

export function useRefreshToken() {
  const token = Cookies.get(TOKEN);
  const refreshToken = Cookies.get(REFRESH_TOKEN);
  const {
    data,
    isPending: isLoading,
    isError,
    error,
  } = useQuery<RefreshTokenResponse>({
    queryKey: ['refreshToken'],
    queryFn: refreshTokenApi,
    enabled: !!token && !!refreshToken,
    staleTime: 20 * 60 * 1000,
    refetchInterval: 20 * 60 * 1000,
    retry: 0,
  });

  return { data, isLoading, isError, error };
}
