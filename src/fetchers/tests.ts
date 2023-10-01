import { HttpMethod, HttpHeaders } from '@/models/http/methods';
import { defaultHeaders } from '@/consts/http/headers';
import { Test } from '@/models/tests/models';

export const basePath = `${process.env.NEXT_PUBLIC_API_PATH}/tests`;

type ListFetcherProps = {
  token: string;
  key: string;
};

export const listFetcher = async ({
  token
}: ListFetcherProps): Promise<Test[]> => {
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

  return response.json() as unknown as Test[];
}