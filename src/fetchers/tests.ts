import { FetcherService } from '@/fetchers/FetcherService';

export class TestFetcher<T> extends FetcherService {
  constructor(token: string) {
    super(`${process.env.NEXT_PUBLIC_API_PATH}/tests`, token);
  }

  async tests(): Promise<T[]> {
    const response = await this.list();
    return response.json() as unknown as T[];
  }

  async test(id: string): Promise<T> {
    const response = await this.get(id);
    return response.json() as unknown as T;
  }
}