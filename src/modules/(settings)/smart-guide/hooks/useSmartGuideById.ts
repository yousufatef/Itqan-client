import { useLanguageQuery } from '@/hooks/useLanguageQuery';
import { getSmartGuideById } from '../services/smart-guide.service';
import { SMART_GUIDE_QUERY_KEY } from '../constants/smartGuide.constants';

export default function useSmartGuideById(id: string) {
  return useLanguageQuery({
    queryKey: [SMART_GUIDE_QUERY_KEY, id],
    queryFn: () => getSmartGuideById(id),
    enabled: !!id,
  });
}
