import { CustomTextarea } from '@/components/forms';
import ActionDialog from '@/components/shared/customs/ActionDialog';
import UserStatus from '@/components/shared/customs/UserStatus';
import type { User } from '@/modules/(settings)/user-mangement/types/user.types';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ResetPasswordInstructions from './ResetPasswordInstructions';
import useResetUserPassword from '@/modules/(settings)/user-mangement/hooks/useResetUserPassword';

type ResetPasswordActionProps = {
  user: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function ResetPasswordAction({ user, isOpen, setIsOpen }: ResetPasswordActionProps) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      note: '',
    },
  });
  const closeDialog = () => setIsOpen(false);

  const onSubmit = async () => {
    const note = form.watch('note');
    await resetPassword({ userId: user.id, note });
  };

  const { resetPassword, isResettingPassword } = useResetUserPassword(() => {
    closeDialog();
    form.reset();
  });

  return (
    <ActionDialog
      className='lg:w-167.5 lg:max-w-none'
      open={isOpen}
      title={t('users.actions.resetPassword')}
      description={t('users.actions.resetPasswordDescription')}
      ActionText={t('users.buttons.sendResetLink')}
      onConfirm={onSubmit}
      onCancel={() => setIsOpen(false)}
      loading={isResettingPassword}
    >
      <div className='flex flex-col gap-6'>
        <UserStatus
          name={user.fullName}
          isActive={user.isActive}
        />

        <CustomTextarea
          optional
          label={t('users.resetPassword.internalNote')}
          placeholder={t('users.resetPassword.placeholderNote')}
          name='note'
          control={form.control}
          disabled={isResettingPassword}
        />

        <ResetPasswordInstructions />
      </div>
    </ActionDialog>
  );
}
