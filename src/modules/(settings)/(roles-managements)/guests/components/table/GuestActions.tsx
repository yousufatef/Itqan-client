import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '@/components/shared/customs/CustomConfirmDialog';
import type { SettingsGuestApi } from '../../services/guests.service';
import useDeleteSettingsGuest from '../../hooks/useDeleteSettingsGuest';

type GuestActionsProps = {
  guest: SettingsGuestApi;
  onEdit: (guest: SettingsGuestApi) => void;
};

function getGuestFullName(guest: SettingsGuestApi) {
  return [guest.firstName, guest.lastName].filter(Boolean).join(' ').trim();
}

const GuestActions = ({ guest, onEdit }: GuestActionsProps) => {
  const { t } = useTranslation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteGuest, isPending } = useDeleteSettingsGuest();
  const guestName = getGuestFullName(guest) || t('rolesManagement.guests.guestFallback');

  return (
    <>
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={() => setIsDeleteOpen(true)}
          className='inline-flex items-center justify-center text-neutral-400 transition-colors hover:text-neutral-700'
          aria-label={t('rolesManagement.guests.actions.delete')}
        >
          <Trash2 className='size-4.5' aria-hidden='true' />
        </button>
        <button
          type='button'
          onClick={() => onEdit(guest)}
          className='inline-flex items-center justify-center text-neutral-400 transition-colors hover:text-neutral-700'
          aria-label={t('rolesManagement.guests.actions.edit')}
        >
          <Pencil className='size-4.5' aria-hidden='true' />
        </button>
      </div>

      <ConfirmDialog
        open={isDeleteOpen}
        title={t('rolesManagement.guests.actions.deleteTitle')}
        description={
          <div className='flex flex-col'>
            <p className='text-secondary-400'>
              {t('rolesManagement.guests.actions.deleteDesc1')}{' '}
              <span className='text-primary-500 font-semibold'>{guestName}</span>{' '}
              {t('rolesManagement.guests.actions.deleteDesc2')}
            </p>
            <p className='text-secondary-400'>{t('warns.actionCantBeUndone')}</p>
          </div>
        }
        onConfirm={() => deleteGuest(guest.id)}
        onCancel={() => setIsDeleteOpen(false)}
        confirmText={t('rolesManagement.guests.actions.delete')}
        cancelText={t('rolesManagement.guests.actions.cancel')}
        loading={isPending}
        mode='destructive'
      />
    </>
  );
};

export default GuestActions;
