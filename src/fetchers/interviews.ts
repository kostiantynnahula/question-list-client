import { HttpMethod } from '@/models/http/methods';
import { FetcherService } from '@/fetchers/FetcherService';
export class InterviewFetcher<T> extends FetcherService {
  constructor(token: string) {
    super(`${process.env.NEXT_PUBLIC_API_PATH}/interviews`, token);
  }

  async interviews(search?: string): Promise<T[]> {
    const path = `${this.path}?search=${search}`;
    const response = await fetch(path, {
      method: HttpMethod.GET,
      headers: this.defaultHeaders(),
    });
    
    return response.json() as unknown as T[];
  }

  async interview(id: string): Promise<T> {
    const response = await this.get(id);

    return response.json() as unknown as T;
  }

  async start(id: string): Promise<Response> {
    const path = `${this.path}/${id}/start`;

    const response = await fetch(path, {
      method: HttpMethod.POST,
      headers: this.defaultHeaders(),
    });

    return response;
  }

  async answers<O>(id: string, extended?: boolean): Promise<O[]> {
    const path = `${this.path}/${id}/answers${extended ? '?extended=true' : ''}`;

    const response = await fetch(path, {
      method: HttpMethod.GET,
      headers: this.defaultHeaders(),
    });

    return response.json() as unknown as O[];
  }

  async tests<O>(id: string) {
    const path = `${this.path}/${id}/test`;

    const response = await fetch(path, {
      method: HttpMethod.GET,
      headers: this.defaultHeaders(),
    });

    return response.json() as unknown as O;
  }
}