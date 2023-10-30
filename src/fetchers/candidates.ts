import { FetcherService } from '@/fetchers/FetcherService';

export const basePath = `${process.env.NEXT_PUBLIC_API_PATH}/candidates`;

export class CandidateFetcher<T> extends FetcherService {
  constructor(token: string) {
    super(`${process.env.NEXT_PUBLIC_API_PATH}/candidates`, token);
  }

  async candidates(): Promise<T[]> {
    const response = await this.list();
    return response.json() as unknown as T[];
  }

  async candidate(id: string): Promise<T> {
    const response = await this.get(id);
    return response.json() as unknown as T;
  }
}