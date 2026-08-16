import { SMART_GUIDE_QUERY_KEY } from '../constants/smartGuide.constants';
import useLanguageQuery from '@/hooks/useLanguageQuery';
import useTableSearchParam from '@/hooks/useTableSearchParam';
import { keepPreviousData } from '@tanstack/react-query';
import { getSmartGuides } from '../services/smart-guide.service';

export default function useSmartGuide() {
  const { searchValue: term, pageNumber, pageSize } = useTableSearchParam();

  return useLanguageQuery({
    queryKey: [SMART_GUIDE_QUERY_KEY, term, pageNumber, pageSize],
    queryFn: () => getSmartGuides(pageNumber, pageSize, term),
    placeholderData: keepPreviousData,
  });
}
