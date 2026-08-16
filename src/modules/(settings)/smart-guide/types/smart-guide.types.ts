export interface HowToUseApp {
  id: string;
  titleEn: string;
  titleIt: string;
  descriptionEn: string;
  descriptionIt: string;
  thumbnailURL: string;
  fileUrl: string;
  order: number;
  createdOn: string;
}

export interface HowToUseAppsResult {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: HowToUseApp[];
}

export interface HowToUseAppsResponse {
  statusCode: number;
  timestamp: string;
  isError: boolean;
  message: string;
  result: HowToUseAppsResult;
}

export interface HowToUseAppByIdResponse {
  statusCode: number;
  timestamp: string;
  isError: boolean;
  message: string;
  result: HowToUseApp;
}