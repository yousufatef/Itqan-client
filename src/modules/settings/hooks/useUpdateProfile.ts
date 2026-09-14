import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/lib/toast';
import { USER_DETAILS_QUERY_KEY } from '@/modules/auth/constants/queryKeys';
import { updateProfile } from '../services/settings.service';
import type { UpdateProfilePayload } from '../types';

type UseUpdateProfileOptions = {
    onSuccess?: () => void;
};

export default function useUpdateProfile(options: UseUpdateProfileOptions = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
        onSuccess: (res: any) => {
            options.onSuccess?.();
            toast.success(res?.message || 'تم حفظ بيانات الحساب بنجاح');
            void queryClient.invalidateQueries({
                queryKey: [USER_DETAILS_QUERY_KEY],
            });
        },
    });
}
