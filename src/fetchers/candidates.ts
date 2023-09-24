import { HttpMethod, HttpHeaders } from '@/models/http/methods';
import { defaultHeaders } from '@/consts/http/headers';
import { Candidate } from '@/models/candidates/models';

export const basePath = `${process.env.NEXT_PUBLIC_API_PATH}/candidates`;

type ListFetcherProps = {
  token: string;
  key: string;
};

export const listFetcher = async ({
  token,
}: ListFetcherProps): Promise<Candidate[]> => {
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

  return response.json() as unknown as Candidate[];
}

export const itemFetcher = async (id: string, token: string): Promise<Candidate> => {
  const response = await fetch(`${basePath}/${id}`, {
    method: HttpMethod.GET,
    headers: {
      ...defaultHeaders,
      [HttpHeaders.AUTHORIZATION]: `Bearer ${token}`,
    }
  });

  return response.json() as unknown as Candidate;
}

export const deleteItem = async (id: string, token: string): Promise<any> => {
  const response = await fetch(`${basePath}/${id}`, {
    method: HttpMethod.DELETE,
    headers: {
      ...defaultHeaders,
      [HttpHeaders.AUTHORIZATION]: `Bearer ${token}`,
    }
  });

  return response;
}