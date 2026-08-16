import type { ValidationErrorApiResponse } from '../types/auth.types';

export const concatErrors = (res: ValidationErrorApiResponse) => {
  if (Array.isArray(res.errors)) return res.errors.join('\r\n');
  return Object.values(res.errors).flat().join('\r\n');
};
