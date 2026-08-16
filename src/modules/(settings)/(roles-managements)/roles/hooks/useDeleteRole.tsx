import { deleteRoleApi, ROLES_LIST_QUERY_KEY } from '@/modules/(settings)/(roles-managements)/roles/services/roles.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useDeleteRole = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteRoleApi(id),
    onSuccess: (res: any) => {
      const message = res?.message || t('roles.actions.deleteSuccess');
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: [ROLES_LIST_QUERY_KEY] });
      setIsDeleteOpen(false);
    },
    onError: (error: Error) => {
      const statusCode = error.cause as number;
      if (statusCode === 404) {
        setIsDeleteOpen(false);
        toast.info(t('roles.actions.alreadyDeleted'), {
          dismissible: true,
        });
        queryClient.invalidateQueries({ queryKey: [ROLES_LIST_QUERY_KEY] });
        return;
      }
    },
  });
  return { ...mutation, isDeleteOpen, setIsDeleteOpen };
};
