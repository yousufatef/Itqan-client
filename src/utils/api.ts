import Cookies from 'js-cookie';
import { toast } from '@/lib/toast';
import { REFRESH_TOKEN, TOKEN } from '../constants';
import { removeAuthCookies } from './cookies';
import type {
  ApiErrorResponse,
  ApiRequestOptions,
  RefreshTokenResponse,
} from '../types/auth.types';
import { trimStringValues } from './input';
import { getCurrLocale } from './language';

const API_URL_RAW = import.meta.env.VITE_BASE_URL as string | undefined;

if (!API_URL_RAW) {
  throw new Error('Missing VITE_BASE_URL environment variable');
}

const API_URL: string = API_URL_RAW;

let refreshTokenPromise: Promise<string | null> | null = null;

type ApiEnvelope<T> = ApiErrorResponse & {
  data?: T;
  result?: T;
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object';
};

function buildUrl(endpoint: string): string {
  const base = API_URL.replace(/\/+$/, '');
  const path = endpoint.replace(/^\/+/, '');
  return `${base}/${path}`;
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined) return undefined;
  return body instanceof FormData ? body : JSON.stringify(trimStringValues(body));
}

function buildHeaders(options: ApiRequestOptions, token?: string): Headers {
  const headers = new Headers(options.headers);
  headers.set('Accept-Language', getCurrLocale());

  if (!options.skipAuth && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const needsJsonContentType =
    options.body !== undefined &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type');

  if (needsJsonContentType) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
}

function request(
  endpoint: string,
  options: ApiRequestOptions & { signal?: AbortSignal },
  token = Cookies.get(TOKEN),
): Promise<Response> {
  const {
    method = 'GET',
    body,
    skipAuth: _skipAuth,
    showErrorToast: _showErrorToast,
    ...fetchInit
  } = options;

  return fetch(buildUrl(endpoint), {
    ...fetchInit,
    method,
    headers: buildHeaders(options, token),
    body: serializeBody(body),
  });
}

function getErrorMessage(data: ApiErrorResponse | null, fallback = 'Something went wrong'): string {
  if (!data) return fallback;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.join('\r\n');
  }

  if (isObject(data.errors)) {
    const message = Object.values(data.errors).flat().join('\r\n');
    if (message) return message;
  }

  return data.message || fallback;
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) return null;

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function throwRequestError(message: string, status?: number, showToast = true): never {
  if (showToast) toast.error(message);
  throw new Error(message, { cause: status });
}

async function handleResponse<T>(response: Response, showToast = true): Promise<T> {
  const data = await parseJson<T & ApiErrorResponse>(response);

  if (!response.ok) {
    throwRequestError(
      getErrorMessage(data, `Request failed with status ${response.status}`),
      response.status,
      showToast,
    );
  }

  if (data?.isError === true) {
    throwRequestError(getErrorMessage(data), data.statusCode ?? data.status, showToast);
  }

  return data as T;
}

function getPayload<T>(response: T | ApiEnvelope<T>): T {
  const result = isObject(response) && 'result' in response ? response.result : response;
  return isObject(result) && 'data' in result ? (result.data as T) : (result as T);
}

function saveTokens(data: RefreshTokenResponse): string | null {
  const accessToken = data.accessToken ?? data.token;
  if (!accessToken) return null;

  Cookies.set(TOKEN, accessToken, {
    expires: getExpiryDate(data.accessTokenExpiresAt ?? data.accessTokenExpiryTime),
  });

  if (data.refreshToken) {
    Cookies.set(REFRESH_TOKEN, data.refreshToken, {
      expires: getExpiryDate(data.refreshTokenExpiresAt ?? data.refreshTokenExpiryTime),
    });
  }

  return accessToken;
}

function getExpiryDate(value?: string): Date | undefined {
  return value ? new Date(value) : undefined;
}

function redirectToSignin(): void {
  removeAuthCookies();
  const returnUrl = window.location.pathname + window.location.search;
  window.location.href = `/login?callbackUrl=${encodeURIComponent(returnUrl)}`;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = Cookies.get(REFRESH_TOKEN);
  if (!refreshToken) return null;

  const response = await fetch(buildUrl('identity/auth/refresh-token'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get(TOKEN)}`,
      'Content-Type': 'application/json',
      Language: getCurrLocale(),
    },
    body: JSON.stringify({ refreshToken: refreshToken }),
  });

  const data = await parseJson<ApiEnvelope<RefreshTokenResponse>>(response);
  if (!response.ok || !data || data.isError === true) {
    removeAuthCookies();
    return null;
  }

  return saveTokens(getPayload<RefreshTokenResponse>(data));
}

function getFreshToken(): Promise<string | null> {
  refreshTokenPromise ??= refreshAccessToken().finally(() => (refreshTokenPromise = null));
  return refreshTokenPromise;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions & { signal?: AbortSignal } = {},
): Promise<T> {
  const response = await request(endpoint, options);

  if (response.status === 401 && !options.skipAuth) {
    const newToken = await getFreshToken();
    if (!newToken) {
      redirectToSignin();
      throw new Error('Session expired. Please sign in again.');
    }

    return handleResponse<T>(await request(endpoint, options, newToken), options.showErrorToast);
  }

  return handleResponse<T>(response, options.showErrorToast);
}
