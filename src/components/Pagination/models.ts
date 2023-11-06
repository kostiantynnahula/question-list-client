export type PaginationQuery = {
  page: number;
  search: string;
}

export type PaginationProps = {
  page: number;
  limit: number;
  total: number;
  length: number;
  onChangePage: (value: number) => void;
}
