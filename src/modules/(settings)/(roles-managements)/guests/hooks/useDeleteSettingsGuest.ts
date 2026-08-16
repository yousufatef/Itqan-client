import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from '@/lib/toast';
import {
  deleteSettingsGuest,
  SETTINGS_GUESTS_QUERY_KEY,
} from '../services/guests.service';

export default function useDeleteSettingsGuest() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSettingsGuest,
    onSuccess: () => {
      toast.success(t('rolesManagement.guests.actions.deleteSuccess'));
      void queryClient.invalidateQueries({ queryKey: [SETTINGS_GUESTS_QUERY_KEY] });
    },
    onError: () => {
      toast.error(t('rolesManagement.guests.actions.deleteFailed'));
    },
  });
}
