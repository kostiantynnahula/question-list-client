import { FetcherService } from '@/fetchers/FetcherService';
import { HttpMethod } from '@/models/http/methods';
import { PaginationRequest } from '@/models/http/requests';

export class TestFetcher<T> extends FetcherService {
  constructor(token: string) {
    super(`${process.env.NEXT_PUBLIC_API_PATH}/tests`, token);
  }

  async testList(isTemplate?: boolean): Promise<T[]> {
    const path = `${this.path}/list?isTemplate=${isTemplate}`;
    const response = await fetch(path, {
      method: HttpMethod.GET,
      headers: this.defaultHeaders(),
    });

    return response.json() as unknown as T[];
  }

  async tests({
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

  async test(id: string): Promise<T> {
    const response = await this.get(id);
    return response.json() as unknown as T;
  }
}