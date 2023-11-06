import { FetcherService } from '@/fetchers/FetcherService';
import { PaginationRequest } from '@/models/http/requests';
import { HttpMethod } from '@/models/http/methods';

export const basePath = `${process.env.NEXT_PUBLIC_API_PATH}/candidates`;

export class CandidateFetcher<T> extends FetcherService {
  constructor(token: string) {
    super(`${process.env.NEXT_PUBLIC_API_PATH}/candidates`, token);
  }

  async candidates({
    search,
    orderBy = 'createdAt',
    order = 'desc',
    take = 10,
    skip = 0,
  }: PaginationRequest): Promise<T[]> {
    const path = `${this.path}?search=${search}&orderBy=${orderBy}&order=${order}&take=${take}&skip=${skip}`;
    const response = await fetch(path, {
      method: HttpMethod.GET,
      headers: this.defaultHeaders(),
    });
    return response.json() as unknown as T[];
  }

  async candidate(id: string): Promise<T> {
    const response = await this.get(id);
    return response.json() as unknown as T;
  }
}