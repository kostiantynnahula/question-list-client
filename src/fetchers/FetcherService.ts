import { HttpMethod, HttpHeaders } from '@/models/http/methods';

export class FetcherService {

  constructor(
    protected readonly path: string,
    protected readonly token: string = '',
  ) {}

  defaultHeaders(): Record<string, string> {
    return {
      [HttpHeaders.CONTENT_TYPE]: 'application/json',
      [HttpHeaders.AUTHORIZATION]: `Bearer ${this.token}`,
    }
  }

  async list() {
    const result = await this.sendRequest(this.path, {
      method: HttpMethod.GET,
      headers: this.defaultHeaders(),
    });
    return result;
  }

  async get(id: string) {
    const path = `${this.path}/${id}`;

    return await this.sendRequest(path, {
      method: HttpMethod.GET,
      headers: this.defaultHeaders(),
    });
  }

  async create(body: string) {
    return await this.sendRequest(this.path, {
      method: HttpMethod.POST,
      headers: this.defaultHeaders(),
      body,
    });
  }

  async delete(id: string) {
    const path = `${this.path}/${id}`;

    return await this.sendRequest(path, {
      method: HttpMethod.DELETE,
      headers: this.defaultHeaders(),
    });
  }

  async update(id: string, body: string) {
    const path  = `${this.path}/${id}`;
  
    return await this.sendRequest(path, {
      method: HttpMethod.PATCH,
      headers: this.defaultHeaders(),
      body,
    });
  }

  async sendRequest(path: string, params: RequestInit): Promise<Response> {
    return await fetch(path, params);
  }
}