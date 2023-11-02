export type PaginationRequest = {
  search: string;
  orderBy: string;
  order: 'asc' | 'desc';
};

export type PaginationResponse<T> = {
  list: T[];
  total: number;
};