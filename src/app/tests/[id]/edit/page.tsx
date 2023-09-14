'use client'
import Link from 'next/link';
import { TestForm } from '@/components/TestForm/TestForm';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const EditPage = () => {

  const params = useParams();
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
    url: `/tests/${params.id}`,
    token: session.data?.user.accessToken,
    id: params.id,
  }, fetcher);

  return (
    <div>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit test</h1>
          <div>
            <Link
              href="/tests"
              className='justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm'
            >Back</Link>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {isLoading && <>Loading...</>}
          {!isLoading && data && <TestForm test={data}/>}
        </div>
      </main>
  </div>
  );
}

export default EditPage;