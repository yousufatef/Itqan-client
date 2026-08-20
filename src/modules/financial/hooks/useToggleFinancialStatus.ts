import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export default function useToggleFinancialStatus(initialStatus: boolean) {
    const [isActive, setIsActive] = useState(initialStatus);
    const { mutate, isPending } = useMutation({
        mutationFn: async (nextStatus: boolean) => nextStatus,
        onSuccess: setIsActive,
    });

    return {
        isActive,
        isPending,
        toggleStatus: () => mutate(!isActive),
    };
}
