import UserStatusBadge from '@/modules/(settings)/user-mangement/components/UserStatusBadge';
import UserInitials from './UserInitials';
import { ACCOUNT_STATUS_CONFIG } from '@/modules/(settings)/user-mangement/constants/user.constants';
import { toActiveStatus } from '@/modules/(settings)/user-mangement/types/user.types';

type UserStatusProps = {
  name: string;
  isActive: boolean;
};

export default function UserStatus({ name, isActive }: UserStatusProps) {
  return (
    <div className='flex items-center justify-between rounded border border-neutral-50 p-4'>
      <div className='flex items-center gap-x-3'>
        <UserInitials
          name={name}
          textClassName='text-lg leading-7 font-medium text-neutral-900'
          avatarClassName='size-12 text-xl font-medium'
          className='size-12'
        />
      </div>

      <UserStatusBadge config={ACCOUNT_STATUS_CONFIG[toActiveStatus(isActive)]} />
    </div>
  );
}
