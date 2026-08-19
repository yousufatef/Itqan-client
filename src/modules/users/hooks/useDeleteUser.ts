import { useMutation } from '@tanstack/react-query';

type UseDeleteUserArgs = {
  onSuccess?: () => void;
};

export default function useDeleteUser({ onSuccess }: UseDeleteUserArgs = {}) {
  return useMutation({
    mutationFn: async (id: string) => id,
    onSuccess,
  });
}