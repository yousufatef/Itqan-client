import { format, isValid, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import type { TFunction } from 'i18next';

import { USER_ACTIVITY_DATE_FORMAT } from '../constants/user.constants';
import type { UserActivity } from '../types/user.types';

export type ActivityItem = {
  id: string;
  title: string;
  date: string;
  details?: string;
  activityType: string;
};

export const getActivityDate = (activity: UserActivity) => {
  if (activity.occurredAtUnix) {
    const unixDate = new Date(activity.occurredAtUnix);
    return isValid(unixDate) ? unixDate : null;
  }

  if (!activity.occurredAtUtc) return null;

  const utcDate = activity.occurredAtUtc.endsWith('Z')
    ? activity.occurredAtUtc
    : `${activity.occurredAtUtc}Z`;
  const normalizedDate = utcDate.replace(/\.(\d{3})\d+(Z)$/, '.$1$2');
  const parsedDate = parseISO(normalizedDate);

  return isValid(parsedDate) ? parsedDate : null;
};

export const getActivityTitle = (activity: UserActivity, t: TFunction) => {
  const labelKey = `users.details.activityTypes.${activity.activityType}`;
  const translatedLabel = t(labelKey);

  if (translatedLabel !== labelKey) return translatedLabel;

  return (
    activity.activityType.replace(/([a-z])([A-Z])/g, '$1 $2')
  );
};

const parseMetadata = (metadata: string): Record<string, unknown> => {
  try {
    const parsedMetadata = JSON.parse(metadata);
    return parsedMetadata && typeof parsedMetadata === 'object' ? parsedMetadata : {};
  } catch {
    return {};
  }
};

const getMetadataText = (metadata: Record<string, unknown>, key: string) => {
  const value = metadata[key];
  return typeof value === 'string' && value.trim() ? value : null;
};

export const getActivityDetails = (activity: UserActivity, t: TFunction) => {
  const metadata = parseMetadata(activity.metadata);
  const device = getMetadataText(metadata, 'deviceName') ?? getMetadataText(metadata, 'deviceModel');
  const country = getMetadataText(metadata, 'country');
  const city = getMetadataText(metadata, 'city');
  const location = [country, city].filter(Boolean).join(' - ');
  const details = [
    device ? `${t('users.details.metadata.device')}: ${device}` : null,
    location ? `${t('users.details.metadata.location')}: ${location}` : null,
  ];

  return details.filter(Boolean).join(' • ') || undefined;
};

export const mapUserActivityToItem = (
  activity: UserActivity,
  locale: Locale,
  t: TFunction,
): ActivityItem => {
  const activityDate = getActivityDate(activity);

  return {
    id: activity.id,
    title: getActivityTitle(activity, t),
    date: activityDate
      ? format(activityDate, USER_ACTIVITY_DATE_FORMAT, { locale })
      : t('users.details.notAvailable'),
    details: getActivityDetails(activity, t),
    activityType: activity.activityType,
  };
};
