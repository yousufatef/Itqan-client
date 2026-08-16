import type { ApiResponse } from '@/types/index.t';

export type ValidationErrorApiResponse = {
  errors: Record<string, string[]> | string[];
  status?: number;
  statusCode?: number;
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiRequestOptions = Omit<RequestInit, 'method' | 'body'> & {
  method?: HttpMethod;
  body?: unknown;
  skipAuth?: boolean;
  showErrorToast?: boolean;
};

export type ApiErrorResponse = {
  isError?: boolean;
  message?: string | null;
  status?: number;
  statusCode?: number;
  errors?: Record<string, string[]> | string[] | null;
};

export type ApiResult<T> = {
  result?: T;
};

export type LoginParams = {
  email: string;
  password: string;
};

export interface LoginResponse {
  id: string;
  isAuthenticated: boolean;
  fullName: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
  username: string;
  email: string;
  phoneNumber?: string | null;
  token: string;
  expiresOn: string;
  accountType: number;
  refreshToken: string;
  refreshTokenExpiration: string;
  role?: LoginRole;
}

export interface LoginRole {
  id: string;
  nameEn: string;
  nameIt?: string;
  description?: string;
  descriptionIt?: string;
  permissions?: Record<string, PermissionActions>;
}

export interface PermissionActions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export type RefreshTokenResponse = {
  token?: string;
  accessToken?: string;
  refreshToken: string;
  accessTokenExpiresAt?: string;
  accessTokenExpiryTime?: string;
  refreshTokenExpiresAt?: string;
  refreshTokenExpiryTime?: string;
  isVerified?: boolean;
};

export type ChangePasswordParams = {
  id?: string;
  oldPassword?: string;
  currentPassword?: string;
  newPassword: string;
  confirmPassword?: string;
};

export type OtpParams = {
  otp: string;
  email: string;
};

export type VerifyAdminParams = {
  otp: string;
  token: string;
};

export type ResetPasswordParams = {
  password: string;
  email: string;
  otp: string;
};

export type ResetAdminPasswordParams = {
  password: string;
  token: string;
};

export type ResetForgotPasswordParams = {
  email: string;
  otp: string;
  newPassword: string;
};

export type EditPasswordParams = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UserPermissionActions = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type UserRoleDetails = {
  nameEn: string;
  nameIt?: string;
  description?: string;
  descriptionIt?: string;
  permissions?: Record<string, UserPermissionActions>;
};

export type UserDetails = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profilePicture?: string | null;
  isSuspended: boolean;
  isDeleted: boolean;
  email: string;
  phoneNumber?: string | null;
};

export type UserApiResponse = ApiResponse<{
  user: UserDetails;
  role?: UserRoleDetails;
}>;
