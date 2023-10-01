import { HttpMethod, HttpHeaders } from '@/models/http/methods';
import { defaultHeaders } from '@/consts/http/headers';
import { Interview } from '@/models/interviews/models';

export const basePath = `${process.env.NEXT_PUBLIC_API_PATH}/interviews`;

type ListFetcherProps = {
  token: string;
  key: string;
};

export const listFetcher = async ({
  token,
}: ListFetcherProps): Promise<Interview[]> => {
  if (!token) {
    return [];
  }
  
  const response = await fetch(basePath, {
    method: HttpMethod.GET,
    headers: {
      ...defaultHeaders,
      [HttpHeaders.AUTHORIZATION]: `Bearer ${token}`,
    }
  });

  return response.json() as unknown as Interview[];
}

export const createItem = async (body: string, token: string) => {
  const response = await fetch(basePath, {
    method: HttpMethod.POST,
    body,
    headers: {
      ...defaultHeaders,
      [HttpHeaders.AUTHORIZATION]: `Bearer ${token}`,
    }
  });

  return response;
}