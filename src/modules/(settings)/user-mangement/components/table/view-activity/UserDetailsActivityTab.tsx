import type { User } from '../../../types/user.types';
import { Eye, LockKeyhole, Smartphone, UserIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import LoadingError from '@/components/shared/error/LoadingError';
import MainLoader from '@/components/shared/loader/MainLoader';
import { formatDistanceToNow } from 'date-fns';
import { arEG, enGB } from 'date-fns/locale';
import { USER_ACTIVITY_PAGE_SIZE, useUserActivity } from '../../../hooks/useUserActivity';
import { mapUserActivityToItem } from '../../../utils/userActivity.utils';
import { useTranslation } from 'react-i18next';
import { useDirection } from '@/i18n/useDirection';

type UserDetailsActivityTabProps = {
  user: User;
};

const getActivityIcon = (activityType: string) => {
  if (activityType === 'UserLogin') return <Smartphone className='size-5 text-neutral-900' />;
  if (activityType === 'PinChanged' || activityType === 'PasswordChanged') {
    return <LockKeyhole className='size-5 text-neutral-900' />;
  }
  if (activityType.includes('View')) return <Eye className='size-5 text-neutral-900' />;

  return <UserIcon className='size-5 text-neutral-900' />;
};

const UserDetailsActivityTab = ({ user }: UserDetailsActivityTabProps) => {
  const { i18n, t } = useTranslation();
  const direction = useDirection();
  const isEnglish = i18n.language.startsWith('en');
  const locale = isEnglish ? enGB : arEG;
  const [activityPageSize, setActivityPageSize] = useState(USER_ACTIVITY_PAGE_SIZE);
  const {
    activities: userActivities,
    error,
    isFetching,
    isLoading,
    lastActive,
    refetch,
    totalCount,
  } = useUserActivity(user.id, activityPageSize);

  const activities = useMemo(
    () => userActivities.map((activity) => mapUserActivityToItem(activity, locale, t)),
    [locale, t, userActivities],
  );

  const hasMoreActivities = activities.length < totalCount;
  const lastActiveDate = lastActive ? new Date(lastActive) : null;

  if (isLoading) return <MainLoader />;

  if (error) {
    return (
      <LoadingError
        errorMsg={error.message}
        isRefetching={isFetching}
        onRefetch={() => void refetch()}
      />
    );
  }

  return (
    <div dir={direction} className='text-start'>
      <div className='rounded-[8px] border border-neutral-50 p-2 mt-2 mb-6'>
        <p className='type-body-sm text-neutral-400'>{t('users.details.lastActive')}</p>
        <div className='mt-2 flex items-center gap-2'>
          <UserIcon className='h-4 w-4 text-neutral-900' aria-hidden='true' />
          <span className='type-body-sm text-neutral-900'>
            {lastActiveDate
              ? formatDistanceToNow(lastActiveDate, { addSuffix: true, locale })
              : t('users.details.noActivityYet')}
          </span>
        </div>
      </div>

      <section>
        <h3 className='mb-4 type-body-md'>{t('users.details.userActivity')}</h3>
        {activities.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-[8px] border border-dashed border-neutral-100 p-6 text-center'>
            <UserIcon className='h-4 w-4 text-neutral-900' aria-hidden='true' />
            <p className='mt-3 type-body-sm text-neutral-900'>
              {t('users.details.noActivityFound')}
            </p>
            <p className='mt-1 type-body-sm text-secondary-400'>
              {t('users.details.noActivityDescription')}
            </p>
          </div>
        ) : (
          <div className='flex flex-col'>
            {activities.map((activity, index) => {
              const hasConnector = index < activities.length - 1 || hasMoreActivities;

              return (
                <div
                  key={activity.id}
                  className='grid grid-cols-[40px_1fr] gap-2'
                >
                  <div className='flex flex-col items-center'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-neutral-50'>
                      {getActivityIcon(activity.activityType)}
                    </div>
                    {hasConnector ? <span className='my-2 h-6 w-px bg-neutral-50' /> : null}
                  </div>

                  <div className='pb-8'>
                    <p className='type-body-sm text-neutral-900'>{activity.title}</p>
                    {activity.details ? (
                      <p className='mt-1 type-body-sm text-neutral-700'>{activity.details}</p>
                    ) : null}
                    <p className='mt-1 type-body-sm text-secondary-400'>{activity.date}</p>
                  </div>
                </div>
              );
            })}
            {hasMoreActivities && (
              <Button
                type='button'
                variant='outline'
                className='mt-4 w-full'
                disabled={isFetching}
                onClick={() =>
                  setActivityPageSize((currentPageSize) =>
                    Math.min(currentPageSize + USER_ACTIVITY_PAGE_SIZE, totalCount),
                  )
                }
              >
                {t('users.details.loadMore')}
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDetailsActivityTab;
