import { apiRequest } from '@/utils/api';
import { generateQueryParams } from '@/utils/params';
import type { CreateUserFormValues, IUser, UpdateUserFormValues, UsersResponse } from '../types';

export const USERS_ENDPOINTS = {
    paginated: 'users/getPaginatedUsers',
    dropdown: 'users/dropdown',
    create: 'users/createUser',
    update: 'users/updateUser',
    deleteById: 'users/deleteUser',
} as const;

export async function getAllUsers(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    role: string
): Promise<UsersResponse> {
    return apiRequest<UsersResponse>(
        `${USERS_ENDPOINTS.paginated}?${generateQueryParams({
            pageNumber,
            pageSize,
            searchTerm,
            role
        })}`,
    );
}

export async function getUsersDropdown(): Promise<unknown> {
    return apiRequest(USERS_ENDPOINTS.dropdown);
}

export function getParentsDropdown(): Promise<{ result: IUser[] }> {
    return apiRequest<{
        result: IUser[] | { data: IUser[] };
    }>(`${USERS_ENDPOINTS.dropdown}?role=parent`).then((response) => ({
        result: Array.isArray(response.result) ? response.result : response.result.data,
    }));
}



export async function createUser(values: CreateUserFormValues): Promise<unknown> {
    return apiRequest(USERS_ENDPOINTS.create, { method: 'POST', body: values });
}

export async function updateUser(
    values: UpdateUserFormValues,
    id: number
): Promise<unknown> {
    return apiRequest(`${USERS_ENDPOINTS.update}/${id}`, { method: 'PATCH', body: values });
}

export async function deleteUser(id: number): Promise<unknown> {
    return apiRequest(`${USERS_ENDPOINTS.deleteById}/${id}`, {
        method: 'DELETE',
    });
}

