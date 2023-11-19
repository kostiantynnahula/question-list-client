import { FetcherService } from '@/fetchers/FetcherService';

export class QuestionFetcher<T> extends FetcherService {
  constructor(token: string) {
    super(`${process.env.NEXT_PUBLIC_API_PATH}/questions`, token);
  }
}