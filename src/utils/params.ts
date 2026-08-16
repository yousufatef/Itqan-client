import type { QueryParams } from '@/types/index.t';

export function generateQueryParams(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== null && v !== undefined) {
          searchParams.append(key, String(v));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
