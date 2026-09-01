import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import type { CreateUserFormValues } from '../types';
import { createUser } from '../services/users.service';

type useCreateUserArg = {
    onSuccess?: () => void;
};

export default function useCreateUser({ onSuccess }: useCreateUserArg = {}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateUserFormValues) => createUser(payload),
        onSuccess: (res: any) => {
            onSuccess?.();
            toast.success(res?.message || "نم انشاء المستخدم بنجاح");
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });
}
