import { keepPreviousData } from '@tanstack/react-query';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import useLanguageQuery from '@/hooks/useLanguageQuery';
import {
  getSettingsGuests,
  SETTINGS_GUESTS_QUERY_KEY,
} from '../services/guests.service';

export default function useSettingsGuests() {
  const { pageNumber, pageSize, searchValue } = useTableSearchParam();

  return useLanguageQuery({
    queryKey: [SETTINGS_GUESTS_QUERY_KEY, pageNumber, pageSize, searchValue],
    queryFn: () =>
      getSettingsGuests({
        pageNumber,
        pageSize,
        searchValue,
      }),
    placeholderData: keepPreviousData,
  });
}
