import { useMutation } from '@tanstack/react-query';
import type { IUser } from '../types';

type UserFormValues = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

type UseUpdateUserArgs = {
    onSuccess?: () => void;
};

type UpdateUserPayload = {
    id: string;
    values: UserFormValues;
};

export default function useUpdateUser({ onSuccess }: UseUpdateUserArgs = {}) {
    return useMutation({
        mutationFn: async ({ values }: UpdateUserPayload) => values,
        onSuccess,
    });
}