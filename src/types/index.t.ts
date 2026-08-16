export type IconProps = { className?: string };

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined | (string | number | boolean)[]
>;

export interface ApiResponse<T> {
  isSuccess: boolean;
  result: T;
  message: string | null;
  errors: string[] | null;
  statusCode: number;
}

export interface ListApiResponse<T> {
  totalCount?: number;
  pageSize?: number;
  pageNumber?: number;
  result: T;
  message: string | null;
  errors: string[] | null;
  statusCode: number;
}

export enum RecordType {
  Building = 0,
  Apartment = 1,
  Service = 2,
  Tax = 3,
  PromoCode = 4,
}
