import type { ActiveStatus, KycStatus } from '../types/user.types';
import { KycStatus as KycStatusEnum } from '../types/user.types';

export const USER_ACCOUNT_STATUS_FILTER_VALUE = {
  INACTIVE: 0,
  ACTIVE: 1,
  SUSPENDED: 2,
} as const;

export type UserAccountStatusFilterValue =
  (typeof USER_ACCOUNT_STATUS_FILTER_VALUE)[keyof typeof USER_ACCOUNT_STATUS_FILTER_VALUE];

export const USER_JOINING_DATE_FILTER_VALUE = {
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
  LAST_90_DAYS: 90,
} as const;

export type UserJoiningDateFilterValue =
  (typeof USER_JOINING_DATE_FILTER_VALUE)[keyof typeof USER_JOINING_DATE_FILTER_VALUE];

export type UserStatusConfig = {
  labelEn: string;
  labelAr: string;
  className: string;
};

export const ACCOUNT_STATUS_CONFIG: Record<ActiveStatus, UserStatusConfig> = {
  active: {
    labelEn: 'Active',
    labelAr: 'نشط',
    className: 'bg-success-50 text-success-500',
  },
  suspended: {
    labelEn: 'Suspended',
    labelAr: 'موقوف',
    className: 'bg-neutral-50 text-neutral-900',
  },
};

export const USER_ACCOUNT_STATUS_FILTER_CONFIG: Record<UserAccountStatusFilterValue, UserStatusConfig> = {
  [USER_ACCOUNT_STATUS_FILTER_VALUE.INACTIVE]: {
    labelEn: 'Inactive',
    labelAr: 'غير نشط',
    className: 'bg-neutral-50 text-neutral-900',
  },
  [USER_ACCOUNT_STATUS_FILTER_VALUE.ACTIVE]: {
    labelEn: 'Active',
    labelAr: 'نشط',
    className: 'bg-success-50 text-success-500',
  },
  [USER_ACCOUNT_STATUS_FILTER_VALUE.SUSPENDED]: {
    labelEn: 'Suspended',
    labelAr: 'موقوف',
    className: 'bg-neutral-50 text-neutral-900',
  },
};

export const KYC_STATUS_CONFIG: Record<KycStatus, UserStatusConfig> = {
  [KycStatusEnum.NONE]: {
    labelEn: 'Not Submitted',
    labelAr: 'لم يتم الإرسال',
    className: 'bg-neutral-50 text-neutral-900',
  },
  [KycStatusEnum.PENDING]: {
    labelEn: 'Pending',
    labelAr: 'قيد الانتظار',
    className: 'bg-accent-50 text-accent-600',
  },
  [KycStatusEnum.APPROVED]: {
    labelEn: 'Verified',
    labelAr: 'موثق',
    className: 'bg-success-50 text-success-500',
  },
  [KycStatusEnum.REJECTED]: {
    labelEn: 'Rejected',
    labelAr: 'مرفوض',
    className: 'bg-error-50 text-error-500',
  },
};

export const USER_ACCOUNT_STATUS_FILTER_OPTIONS = [
  { value: USER_ACCOUNT_STATUS_FILTER_VALUE.INACTIVE, label: 'Inactive' },
  { value: USER_ACCOUNT_STATUS_FILTER_VALUE.ACTIVE, label: 'Active' },
  { value: USER_ACCOUNT_STATUS_FILTER_VALUE.SUSPENDED, label: 'Suspended' },
] as const;

export const USER_KYC_STATUS_FILTER_OPTIONS = [
  { value: KycStatusEnum.NONE, label: 'Not Submitted' },
  { value: KycStatusEnum.PENDING, label: 'Pending' },
  { value: KycStatusEnum.APPROVED, label: 'Verified' },
  { value: KycStatusEnum.REJECTED, label: 'Rejected' },
] as const;

export const USER_JOINING_DATE_FILTER_OPTIONS = [
  { value: USER_JOINING_DATE_FILTER_VALUE.LAST_7_DAYS, label: 'Last 7 Days' },
  { value: USER_JOINING_DATE_FILTER_VALUE.LAST_30_DAYS, label: 'Last 30 Days' },
  { value: USER_JOINING_DATE_FILTER_VALUE.LAST_90_DAYS, label: 'Last 90 Days' },
] as const;

export const ACCOUNT_AVATAR_CONFIG: Record<ActiveStatus, string> = {
  active: 'bg-primary-500 text-primary-50',
  suspended: 'bg-neutral-200 text-neutral-500',
};

export const USER_ACTIVITY_DATE_FORMAT = 'dd MMMM yyyy, hh:mm a';
