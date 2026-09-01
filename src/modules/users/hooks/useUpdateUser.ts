import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import type { CreateUserFormValues } from '../types';
import { updateUser } from '../services/users.service';

type useUpdateUserArg = {
    onSuccess?: () => void;
};

export default function useUpdateUser({ onSuccess }: useUpdateUserArg = {}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateUserFormValues) => updateUser(payload),
        onSuccess: (res: any) => {
            onSuccess?.();
            toast.success(res?.message || "نم تحديث المستخدم بنجاح");
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },
    });
}
