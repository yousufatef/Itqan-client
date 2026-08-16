import type { User } from '../../../types/user.types';
import type { ReactNode } from 'react';
import { format } from 'date-fns';
import { arEG, enGB } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useDirection } from '@/i18n/useDirection';
import { CalendarDays, Mail, Phone, User as UserLucide } from 'lucide-react';

type UserDetailsOverviewTabProps = {
  user: User;
};

type OverviewItem = {
  label: string;
  value: string;
  icon: ReactNode;
};

const UserDetailsOverviewTab = ({ user }: UserDetailsOverviewTabProps) => {
  const { i18n, t } = useTranslation();
  const direction = useDirection();
  const userName = user.fullName;
  const isEnglish = i18n.language.startsWith('en');
  const notAvailable = t('users.details.notAvailable');
  const overviewItems: OverviewItem[] = [
    {
      label: t('users.details.fullName'),
      value: userName || notAvailable,
      icon: <UserLucide className='size-5 text-neutral-900' aria-hidden='true' />,
    },
    {
      label: t('users.details.email'),
      value: user.email || notAvailable,
      icon: <Mail className='size-5 text-neutral-900' aria-hidden='true' />,
    },
    {
      label: t('users.details.mobileNumber'),
      value: user.phoneNumber || notAvailable,
      icon: <Phone className='size-5 text-neutral-900' aria-hidden='true' />,
    },
    {
      label: t('users.details.joiningDate'),
      value: user.createdOn
        ? format(new Date(user.createdOn), 'dd MMMM yyyy', { locale: isEnglish ? enGB : arEG })
        : notAvailable,
      icon: <CalendarDays className='size-5 text-neutral-900' aria-hidden='true' />,
    },
  ];

  return (
    <section dir={direction} className='text-start'>
      <h3 className='mb-4 type-body-md'>{t('users.details.basicInformation')}</h3>
      <div className='flex flex-col gap-3'>
        {overviewItems.map((item) => (
          <div
            key={item.label}
            className='flex flex-col gap-2'
          >
            <p className='type-body-sm text-neutral-400'>{item.label}</p>
            <div className='flex items-center gap-2'>
              {item.icon}
              <span className='type-body-sm text-neutral-900'>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserDetailsOverviewTab;
