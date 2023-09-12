'use client'

import Link from 'next/link';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

const Tests = () => {

  const session = useSession();

  const fetcher = async (params: { url: string, token: string }) => {
    const path = `${process.env.NEXT_PUBLIC_API_PATH}${params.url}`;
    
    const response = await fetch(path, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${params.token}`
      }
    });

    return response.json();
  }

  const { data, isLoading } = useSWR({
    url: '/tests',
    token: session.data?.user.accessToken
  }, fetcher);

  return (
    <div>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Test List</h1>
          <div>
            <Link
              href="/tests/create"
              className='justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm'
            >Create</Link>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <ul role="list" className="divide-y divide-gray-100">
            {isLoading && <p>Loading...</p>}
            {!isLoading && data.length && data.map((test) => (
              <li key={test.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <Link href={`/tests/${test.id}/edit`}>
                    <p className="text-sm font-semibold leading-6 text-gray-900">{test.name}</p>
                  </Link>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <div className="mt-1 flex items-center gap-x-1.5">
                  <p className="text-xs leading-5 text-gray-500">{test.createdAt}</p>
                </div>
              </div>
            </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Tests