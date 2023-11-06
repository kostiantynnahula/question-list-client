export type PaginationRequest = {
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  take?: number;
  skip?: number;
};

export type PaginationResponse<T> = {
  list: T[];
  total: number;
};