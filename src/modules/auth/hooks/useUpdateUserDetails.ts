import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/lib/toast';
import { USER_DETAILS_QUERY_KEY } from '@/modules/auth/constants/queryKeys';
import {
    updateUserDetails,
    type UpdateUserDetailsPayload,
} from '@/modules/auth/service/auth.service';

export default function useUpdateUserDetails() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: UpdateUserDetailsPayload) => updateUserDetails(values),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [USER_DETAILS_QUERY_KEY] });
            toast.success('تم حفظ بيانات الحساب بنجاح');
        },
    });
}
