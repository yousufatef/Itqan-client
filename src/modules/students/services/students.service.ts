import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type { IStudent } from '../types';

export const STUDENTS_ENDPOINTS = {
  paginated: 'students/getPaginatedStudents',
  create: 'students/createStudent',
  update: 'students/updateStudent',
  delete: 'students/deleteStudent',
} as const;

export type StudentsResponse = {
  result: {
    data: IStudent[];
    totalCount: number;
  };
};

export type StudentPayload = {
  name: string;
  phoneNumber: string;
  birthOfDate: string;
  parent_id: number;
};

type StudentListApiResponse = {
  result: {
    data: IStudent[];
    totalCount?: number;
    meta?: {
      total?: number;
    };
  };
};

export function getAllStudents(
  pageNumber: number,
  pageSize: number,
  searchTerm: string,
): Promise<StudentsResponse> {
  return apiRequest<StudentListApiResponse>(
    `${STUDENTS_ENDPOINTS.paginated}?${generateQueryParams({
      pageNumber,
      pageSize,
      searchTerm,
    })}`,
  ).then((response) => ({
    result: {
      data: response.result.data,
      totalCount: response.result.totalCount ?? response.result.meta?.total ?? response.result.data.length,
    },
  }));
}

export function createStudent(values: StudentPayload): Promise<unknown> {
  return apiRequest(STUDENTS_ENDPOINTS.create, {
    method: 'POST',
    body: values,
  });
}

export function updateStudent(id: string, values: StudentPayload): Promise<unknown> {
  return apiRequest(`${STUDENTS_ENDPOINTS.update}/${id}`, {
    method: 'PATCH',
    body: values,
  });
}

export function deleteStudent(id: string): Promise<unknown> {
  return apiRequest(`${STUDENTS_ENDPOINTS.delete}/${id}`, {
    method: 'DELETE',
  });
}