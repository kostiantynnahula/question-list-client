import { FetcherService } from '@/fetchers/FetcherService';

export class CategoryFetcher<T> extends FetcherService {
  constructor(token: string) {
    super(`${process.env.NEXT_PUBLIC_API_PATH}/categories`, token);
  }
}