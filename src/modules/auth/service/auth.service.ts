import Cookies from 'js-cookie';
import { REFRESH_TOKEN, TOKEN } from '../../../constants';
import type {
  ApiResult,
  ChangePasswordParams,
  LoginParams,
  LoginResponse,
  OtpParams,
  RefreshTokenResponse,
  ResetAdminPasswordParams,
  ResetForgotPasswordParams,
} from '../types/auth.types';
import { apiRequest } from '@/utils/api';

export const AUTH_ENDPOINTS = {
  currentUser: 'users/profile',
  updateCurrentUser: 'users/profile',
  login: 'auth/login',
  refreshToken: 'auth/refresh',
  forgotPasswordOtp: 'auth/forgot-password',
  validateOtp: 'auth/verify-otp',
  forgetPassword: 'auth/reset-password',
  resetPassword: 'auth/reset-password',
  resendOtp: 'auth/forgot-password',
  setPasswordInvite: 'auth/set-password-invite',
  logout: 'auth/logout',
} as const;

function getResult<T>(response: T | ApiResult<T>): T {
  return 'result' in Object(response) ? ((response as ApiResult<T>).result as T) : (response as T);
}

function getData<T>(response: T | ApiResult<T> | { data?: T }): T {
  const result = getResult(response);
  return 'data' in Object(result) ? ((result as { data?: T }).data as T) : (result as T);
}

function setCookieWithOptionalExpiry(name: string, value: string, expiresAt?: string) {
  if (expiresAt) {
    Cookies.set(name, value, { expires: new Date(expiresAt) });
    return;
  }

  Cookies.set(name, value);
}

function saveRefreshTokens(payload: RefreshTokenResponse) {
  const accessToken = payload.accessToken ?? payload.token;
  const refreshToken = payload.refreshToken;
  const accessExpires = payload.accessTokenExpiresAt ?? payload.accessTokenExpiryTime;
  const refreshExpires = payload.refreshTokenExpiresAt ?? payload.refreshTokenExpiryTime;

  if (!accessToken || !refreshToken) {
    throw new Error('Refresh token response is missing tokens.');
  }

  setCookieWithOptionalExpiry(TOKEN, accessToken, accessExpires);
  setCookieWithOptionalExpiry(REFRESH_TOKEN, refreshToken, refreshExpires);
}

export async function getUserDetails<TUser = unknown>() {
  const response = await apiRequest<TUser | ApiResult<TUser>>(AUTH_ENDPOINTS.currentUser, {
    method: 'GET',
  });

  return getResult(response);
}

export type UpdateUserDetailsPayload = {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
};

export async function updateUserDetails({
  id,
  username,
  email,
  phoneNumber,
}: UpdateUserDetailsPayload) {
  const body = new FormData();
  body.append('id', id);
  body.append('username', username);
  body.append('email', email);
  body.append('phoneNumber', phoneNumber);

  return apiRequest(AUTH_ENDPOINTS.updateCurrentUser, {
    method: 'POST',
    body,
  });
}

export async function loginApi({ email, password }: LoginParams): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse | ApiResult<LoginResponse>>(
    AUTH_ENDPOINTS.login,
    {
      method: 'POST',
      skipAuth: true,
      body: {
        email,
        password,
      },
    },
  );

  return getResult(response);
}

export async function refreshTokenApi(): Promise<RefreshTokenResponse> {
  const token = Cookies.get(TOKEN);
  const refreshToken = Cookies.get(REFRESH_TOKEN);

  const response = await apiRequest<RefreshTokenResponse | ApiResult<RefreshTokenResponse>>(
    AUTH_ENDPOINTS.refreshToken,
    {
      method: 'POST',
      body: {
        accessToken: token,
        refreshToken,
      },
    },
  );

  const payload = getData(response);
  saveRefreshTokens(payload);

  return payload;
}

export async function forgetPasswordApi({ email }: { email: string }) {
  return apiRequest<unknown>(
    `${AUTH_ENDPOINTS.forgotPasswordOtp}?${new URLSearchParams({
      emailOrPhoneNumber: email,
    }).toString()}`,
    {
      method: 'POST',
      skipAuth: true,
    },
  );
}

export async function resendOtpApi({ email }: { email: string }) {
  return apiRequest<unknown>(
    `${AUTH_ENDPOINTS.resendOtp}?${new URLSearchParams({
      emailOrPhoneNumber: email,
    }).toString()}`,
    {
      method: 'POST',
      skipAuth: true,
    },
  );
}

export async function otpApi({ otp, email }: OtpParams) {
  return apiRequest<{ message?: string | null }>(AUTH_ENDPOINTS.validateOtp, {
    method: 'POST',
    skipAuth: true,
    body: {
      otp,
      EmailOrPhoneNumber: email,
    },
  });
}

export async function resetAdminPasswordApi({
  email,
  otp,
  newPassword,
}: ResetForgotPasswordParams) {
  return apiRequest<unknown>(AUTH_ENDPOINTS.forgetPassword, {
    method: 'POST',
    skipAuth: true,
    body: {
      newPassword,
      otp,
      emailOrPhoneNumber: email,
    },
  });
}

export async function resetPasswordUserApi({ email, otp, newPassword }: ResetForgotPasswordParams) {
  return resetAdminPasswordApi({ email, otp, newPassword });
}

export async function setPasswordInviteApi({ password, token }: ResetAdminPasswordParams) {
  return apiRequest<unknown>(AUTH_ENDPOINTS.setPasswordInvite, {
    method: 'POST',
    body: {
      password,
      confirmPassword: password,
      token,
    },
  });
}

export async function changePasswordApi(data: ChangePasswordParams) {
  return apiRequest<unknown>(AUTH_ENDPOINTS.resetPassword, {
    method: 'POST',
    body: {
      id: data.id,
      currentPassword: data.currentPassword ?? data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword ?? data.newPassword,
    },
  });
}

export async function logOutApi() {
  return apiRequest<unknown>(AUTH_ENDPOINTS.logout, {
    method: 'POST',
  });
}
