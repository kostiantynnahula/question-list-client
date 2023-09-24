import { HttpMethod, HttpHeaders } from '@/models/http/methods';
import { defaultHeaders } from '@/consts/http/headers';
import { Candidate } from '@/models/candidates/models';

export const basePath = `${process.env.NEXT_PUBLIC_API_PATH}/candidates`;

type ListFetcherProps = {
  token: string;
  key: string;
};

type ItemFetchProps = ListFetcherProps & { id: string };

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

export const itemFetcher = async ({
  id,
  token
}: ItemFetchProps): Promise<Candidate | undefined> => {
  if (!token) {
    return undefined;
  }
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

export const updateItem = async (body: string, id: string, token: string) => {
  const path = `${basePath}/${id}`;
  const response = await fetch(path, {
    method: HttpMethod.PATCH,
    body,
    headers: {
      ...defaultHeaders,
      [HttpHeaders.AUTHORIZATION]: `Bearer ${token}`,
    }
  });

  return response;
}