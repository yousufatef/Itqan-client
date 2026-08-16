import {
  getRoles,
  ROLES_LIST_QUERY_KEY,
} from '@/modules/(settings)/(roles-managements)/roles/services/roles.service';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import useLanguageQuery from '@/hooks/useLanguageQuery';
import { keepPreviousData } from '@tanstack/react-query';

export default function useRoles() {
  const { pageNumber, pageSize, sortBy, sortOrder, searchValue } = useTableSearchParam();

  const query = useLanguageQuery({
    queryKey: [ROLES_LIST_QUERY_KEY, pageNumber, pageSize, searchValue, sortBy, sortOrder],
    queryFn: () =>
      getRoles({
        pageNumber,
        pageSize,
        sortBy,
        sortOrder,
        searchValue,
      }),

    placeholderData: keepPreviousData,
  });

  return query;
}
