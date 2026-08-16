import type { UserStatusConfig } from '../constants/user.constants';
import { useDirection } from '@/i18n/useDirection';

type UserStatusBadgeProps = {
  config: UserStatusConfig;
};

const UserStatusBadge = ({ config }: UserStatusBadgeProps) => {
  const direction = useDirection();
  const isEnglish = direction === 'ltr';

  return (
    <span
      className={`inline-flex max-w-fit items-center rounded-[8px] px-4 py-2 text-xs font-medium ${config.className}`}
    >
      {isEnglish ? config.labelEn : config.labelAr}
    </span>
  );
};

export default UserStatusBadge;
