import { useMutation } from '@tanstack/react-query';
import type { IUser } from '../types';

type UserFormValues = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

type UseCreateUserArgs = {
    onSuccess?: () => void;
};

export default function useCreateUser({ onSuccess }: UseCreateUserArgs = {}) {
    return useMutation({
        mutationFn: async (values: UserFormValues) => values,
        onSuccess,
    });
}