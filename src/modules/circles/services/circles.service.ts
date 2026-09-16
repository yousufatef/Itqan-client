import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type {
  CircleSingleResponse,
  CirclesResponse,
  CreateCirclePayload,
  CreateDailyRecordItem,
  DailyRecordsResponse,
  ICircle,
  IDailyRecord,
  UpdateCirclePayload,
} from '../types';

export const CIRCLES_ENDPOINTS = {
  circles: 'circles',
  getById: (id: string | number) => `circles/${id}`,
  delete: (id: string | number) => `circles/${id}`,
  dailyRecords: (circleId: string | number) => `circles/${circleId}/daily-records`,
} as const;

export async function getAllCircles(
  pageNumber?: number,
  pageSize?: number,
  searchTerm?: string,
): Promise<CirclesResponse> {
  const query = generateQueryParams({
    pageNumber,
    pageSize,
    searchTerm,
  });
  const endpoint = query ? `${CIRCLES_ENDPOINTS.circles}?${query}` : CIRCLES_ENDPOINTS.circles;

  return apiRequest<CirclesResponse | { result: ICircle[] | { data: ICircle[]; totalCount?: number } }>(
    endpoint,
  ).then((response) => {
    if ('result' in response) {
      const res = response.result;
      if (Array.isArray(res)) {
        return {
          result: {
            data: res,
            totalCount: res.length,
          },
        };
      }
      if ('data' in res && Array.isArray(res.data)) {
        const metaTotal = 'meta' in res && res.meta ? res.meta.total : undefined;
        return {
          result: {
            data: res.data,
            totalCount: res.totalCount ?? metaTotal ?? res.data.length,
          },
        };
      }
    }
    return {
      result: {
        data: (response as unknown as ICircle[]) || [],
        totalCount: 0,
      },
    };
  });
}

export async function getCircleById(id: string | number): Promise<ICircle | null> {
  return apiRequest<CircleSingleResponse | ICircle>(CIRCLES_ENDPOINTS.getById(id)).then(
    (response) => {
      if (response && typeof response === 'object' && 'result' in response) {
        return (response as CircleSingleResponse).result;
      }
      return response as ICircle;
    },
  );
}

export async function createCircle(payload: CreateCirclePayload): Promise<unknown> {
  return apiRequest(CIRCLES_ENDPOINTS.circles, {
    method: 'POST',
    body: payload,
  });
}

export async function updateCircle(
  payload: UpdateCirclePayload,
  id?: string | number,
): Promise<unknown> {
  const endpoint = id ? CIRCLES_ENDPOINTS.getById(id) : CIRCLES_ENDPOINTS.circles;
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteCircle(id: string | number): Promise<unknown> {
  return apiRequest(CIRCLES_ENDPOINTS.delete(id), {
    method: 'DELETE',
  });
}

export async function getDailyRecords(
  circleId: string | number,
  date?: string,
): Promise<IDailyRecord[]> {
  const endpoint = CIRCLES_ENDPOINTS.dailyRecords(circleId);
  const url = date ? `${endpoint}?date=${date}` : endpoint;

  return apiRequest<DailyRecordsResponse | IDailyRecord[]>(url).then((response) => {
    if (response && typeof response === 'object' && 'result' in response) {
      return (response as DailyRecordsResponse).result || [];
    }
    return (response as IDailyRecord[]) || [];
  });
}

export async function createDailyRecords(
  circleId: string | number,
  records: CreateDailyRecordItem[],
): Promise<unknown> {
  return apiRequest(CIRCLES_ENDPOINTS.dailyRecords(circleId), {
    method: 'POST',
    body: records,
  });
}
