export interface PromoCode {
  id: string;
  codeNameEn: string;
  codeNameIt: string;
  discountType: number;
  discountValue: number;
  code: string;
  maxUsesPerUser: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PromoCodeResult {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  items: PromoCode[];
}

export interface GetPromoCodesResponse {
  statusCode: number;
  timestamp: string;
  isError: boolean;
  message: string;
  result: PromoCodeResult;
}
