import { HttpMethod } from '@/models/http/methods';
import { FetcherService } from '@/fetchers/FetcherService';

export class AnswerFetcher<T> extends FetcherService {
  constructor(token: string) {
    super(`${process.env.NEXT_PUBLIC_API_PATH}/answers`, token);
  }

  async setAnswer(answerId: string, body: string): Promise<Response> {
    const path = `${this.path}/${answerId}`;

    const response = await fetch(path, {
      method: HttpMethod.PATCH,
      headers: this.defaultHeaders(),
      body,
    });

    return response;
  }
}