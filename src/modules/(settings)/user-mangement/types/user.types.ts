export const KycStatus = {
  NONE: 0,
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus];

export type ActiveStatus = 'active' | 'suspended';

export const toActiveStatus = (isActive: boolean): ActiveStatus =>
  isActive ? 'active' : 'suspended';

export type User = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  kycStatus: KycStatus;
  createdOn: string;
  updatedOn?: string;
};

export type UserTableRow = User & {
  rowNumber: number;
};

export type UsersListData = {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  result: User[];
};

export type UsersListResponse = {
  statusCode: number;
  timestamp: string;
  isSuccess: boolean;
  message: string;
  data: UsersListData;
};

export type UsersListFilters = {
  accountStatuses?: number[];
  kycStatuses?: number[];
  joiningDaysAgo?: number;
};

export type LastLoginResponse = {
  isSuccess: boolean;
  data: number | null;
  message: string;
  errors: string[] | null;
  statusCode: number;
};

export type UserActivity = {
  id: string;
  userId: string;
  activityType:
    | 'AccountCreated'
    | 'UserLogin'
    | 'PinChanged'
    | 'PasswordChanged'
    | 'UserViewed'
    | string;
  occurredAtUnix?: number;
  occurredAtUtc?: string;
  metadata: string;
};

export type UserActivityResponse = {
  isSuccess: boolean;
  data: {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    result: UserActivity[];
  };
  message: string;
  errors: string[] | null;
  statusCode: number;
};

export type UserActivityData = {
  activities: UserActivity[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  lastActive: number | null;
};
