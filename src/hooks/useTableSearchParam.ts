import { generateQueryParams } from '@/utils/params';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type TableSearchParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | (string | number | boolean)[];

export type TableSearchParams = Record<string, TableSearchParamValue>;

type UseTableSearchParamOptions = {
  resetPageParamName?: string;
  shouldResetPage?: boolean;
};

const isEmptyValue = (value: TableSearchParamValue) => {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;

  return false;
};

const searchParamsToObject = (searchParams: URLSearchParams) => {
  const params: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const currentValue = params[key];

    if (Array.isArray(currentValue)) {
      params[key] = [...currentValue, value];
      return;
    }

    params[key] = currentValue ? [currentValue, value] : value;
  });

  return params;
};

export function useTableSearchParam({
  resetPageParamName = 'page',
  shouldResetPage = true,
}: UseTableSearchParamOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => searchParamsToObject(searchParams), [searchParams]);
  const pageNumber = Number(searchParams.get('pageNumber')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const searchValue = searchParams.get('searchValue') || '';
  const sortBy = Number(searchParams.get('sortBy') || 0);
  const status = searchParams.get('status') || '';
  const sortOrder = Number(searchParams.get('sortOrder') || 0);
  const suspensionType = searchParams.get('suspensionType') || '';

  const queryString = useMemo(() => generateQueryParams(params), [params]);

  const setTableSearchParams = useCallback(
    (nextParams: TableSearchParams) => {
      setSearchParams((currentSearchParams) => {
        const updatedSearchParams = new URLSearchParams(currentSearchParams);

        Object.entries(nextParams).forEach(([key, value]) => {
          updatedSearchParams.delete(key);

          if (isEmptyValue(value)) return;

          if (Array.isArray(value)) {
            value.forEach((item) => {
              updatedSearchParams.append(key, String(item));
            });
            return;
          }

          updatedSearchParams.set(key, String(value));
        });

        if (shouldResetPage) updatedSearchParams.delete(resetPageParamName);

        return updatedSearchParams;
      });
    },
    [resetPageParamName, setSearchParams, shouldResetPage],
  );

  const setTableSearchParam = useCallback(
    (key: string, value: TableSearchParamValue) => {
      setTableSearchParams({ [key]: value });
    },
    [setTableSearchParams],
  );

  const clearTableSearchParams = useCallback(
    (paramNames?: string[]) => {
      setSearchParams((currentSearchParams) => {
        if (!paramNames) return new URLSearchParams();

        const updatedSearchParams = new URLSearchParams(currentSearchParams);

        paramNames.forEach((paramName) => {
          updatedSearchParams.delete(paramName);
        });

        if (shouldResetPage) updatedSearchParams.delete(resetPageParamName);

        return updatedSearchParams;
      });
    },
    [resetPageParamName, setSearchParams, shouldResetPage],
  );

  const getTableSearchParam = useCallback(
    (key: string) => searchParams.get(key) ?? '',
    [searchParams],
  );

  return {
    clearTableSearchParams,
    getTableSearchParam,
    params,
    pageNumber,
    pageSize,
    queryString,
    searchValue,
    sortBy,
    sortOrder,
    searchParams,
    status,
    suspensionType,
    setTableSearchParam,
    setTableSearchParams,
  };
}

export default useTableSearchParam;
