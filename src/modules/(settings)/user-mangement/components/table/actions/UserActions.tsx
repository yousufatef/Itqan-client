import MoreActions from '@/components/shared/customs/MoreActions';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { User } from '../../../types/user.types';
import UserActivitySheetContent from '../view-activity/UserActivitySheetContent';
import ActionDialog from '@/components/shared/customs/ActionDialog';
import { Activity, CheckCircle, KeyRound } from 'lucide-react';
import ResetPasswordAction from './reset-password/ResetPasswordAction';
import { getCurrLocale } from '@/utils/language';

type UserActionsProps = {
  user: User;
};

const UserActions = ({ user }: UserActionsProps) => {
  const { t } = useTranslation();
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
  const [isForgetPasswordDialogOpen, setIsForgetPasswordDialogOpen] = useState(false);
  const [isOverviewSheetOpen, setIsOverviewSheetOpen] = useState(false);
  const [isSuspendSheetOpen, setIsSuspendSheetOpen] = useState(false);
  const isEnglish = getCurrLocale() === 'en';
  return (
    <>
      <MoreActions
        actions={[
          // {
          //   onClick: () => setIsReactivateDialogOpen(true),
          //   text: t('users.actions.reactivateAccount'),
          //   variant: 'default',
          //   icon: <UserIcons name='reactivateAccount' />,
          //   permissions: ['users.update'],
          // },
          {
            onClick: () => setIsForgetPasswordDialogOpen(true),
            text: t('users.actions.resetPassword'),
            variant: 'default',
            icon: <KeyRound className='h-4 w-4' aria-hidden='true' />,
            permissions: ['users.update'],
            disabled: !user.isActive,
          },
          {
            onClick: () => setIsOverviewSheetOpen(true),
            text: t('users.actions.viewActivityLog'),
            variant: 'default',
            icon: <Activity className='h-4 w-4' aria-hidden='true' />,
            permissions: ['users.read'],
          },
          // {
          //   onClick: () => setIsSuspendSheetOpen(true),
          //   text: t('users.actions.suspendAccount'),
          //   variant: 'default',
          //   icon: <UserIcons name='suspendAccount' />,
          //   permissions: ['users.update'],
          // },
        ]}
      />

      <ActionDialog
        open={isReactivateDialogOpen}
        title={t('users.actions.reactivateAccount')}
        description={t('users.actions.reactivateAccountDescription')}
        ActionText={t('users.actions.reactivateAccount')}
        onConfirm={() => { }}
        onCancel={() => setIsReactivateDialogOpen(false)}
        icon={<CheckCircle className='size-full' />}
      >
        {/* reactivate form */}
        <div></div>
      </ActionDialog>

      <ResetPasswordAction
        isOpen={isForgetPasswordDialogOpen}
        setIsOpen={setIsForgetPasswordDialogOpen}
        user={user}
      />

      <Sheet
        open={isOverviewSheetOpen}
        onOpenChange={setIsOverviewSheetOpen}
      >
        <SheetContent side={isEnglish ? 'right' : 'left'} className='gap-0 p-0 data-[side=left]:sm:max-w-[471px] data-[side=right]:sm:max-w-[471px]'>
          <UserActivitySheetContent user={user} />
        </SheetContent>
      </Sheet>

      <Sheet
        open={isSuspendSheetOpen}
        onOpenChange={setIsSuspendSheetOpen}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('users.actions.suspendAccount')}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UserActions;
