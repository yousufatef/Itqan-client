export interface TaxType {
  id: number | string;
  name: string;
  nameEn?: string;
  nameIt?: string;
  type?: number;
}

export interface TaxTypesResult {
  result: TaxType[];
  totalCount: number;
}

export interface GetTaxTypesResponse {
  statusCode: number;
  timestamp: string;
  isError: boolean;
  message: string;
  result: TaxTypesResult;
}
