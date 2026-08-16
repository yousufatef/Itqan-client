import {
  type DefaultError,
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

/**
 * A wrapper around useQuery that automatically includes the current locale in the queryKey.
 * This ensures that queries are refetched when the language/locale changes.
 *
 * @example
 * // Instead of:
 * // useQuery({
 * //   queryKey: ['categories'],
 * //   queryFn: fetchCategories,
 * // })
 *
 * // Use:
 * // useLanguageQuery({
 * //   queryKey: ['categories'],
 * //   queryFn: fetchCategories,
 * // })
 *
 * // The locale will be automatically appended to the queryKey
 * // So the actual queryKey becomes: ['categories', 'en'] or ['categories', 'ar']
 */
export function useLanguageQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'> & {
    queryKey: TQueryKey;
  },
): UseQueryResult<TData, TError> {
  const locale = useTranslation().i18n.language;

  // Append locale to the queryKey
  const queryKeyWithLocale = [...options.queryKey, locale] as unknown as TQueryKey;

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryKey: queryKeyWithLocale,
  });
}

export default useLanguageQuery;
