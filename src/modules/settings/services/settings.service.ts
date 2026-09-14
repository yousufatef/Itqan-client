import { apiRequest } from '@/utils/api';
import type { UpdateProfilePayload } from '../types';

export const SETTINGS_ENDPOINTS = {
    updateProfile: 'users/profile',
} as const;

export async function updateProfile(payload: UpdateProfilePayload): Promise<unknown> {
    return apiRequest(SETTINGS_ENDPOINTS.updateProfile, {
        method: 'PATCH',
        body: payload,
    });
}
