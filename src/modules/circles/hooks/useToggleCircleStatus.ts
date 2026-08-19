import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

type UseToggleCircleStatusResult = {
    isActive: boolean;
    isPending: boolean;
    toggleStatus: () => void;
};

export default function useToggleCircleStatus(initialStatus: boolean): UseToggleCircleStatusResult {
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
