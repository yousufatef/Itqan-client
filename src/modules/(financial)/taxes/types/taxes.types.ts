export type TaxesFinancialListItem = {
  id: string;
};

export interface Tax {
  id: string;
  nameEn: string;
  nameIt: string;
  rate: number;
  descriptionEn: string;
  descriptionIt: string;
  type: number;
  calculationType: number;
  typeName: string;
  isActive: boolean;
}

export interface TaxesResult {
  result: Tax[];
  totalCount: number;
}

export interface GetTaxesResponse {
  statusCode: number;
  timestamp: string;
  isError: boolean;
  message: string;
  result: TaxesResult;
}
