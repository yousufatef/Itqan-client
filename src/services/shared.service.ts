import type { ApiResponse, RecordType } from '@/types/index.t';
import { apiRequest } from '@/utils/api';

export const changeRecordStatus = (id: string, type: RecordType): Promise<ApiResponse<unknown>> => {
  return apiRequest(`/ChangeStatus/toggle`, {
    body: { id, type },
    method: 'POST',
  });
};
