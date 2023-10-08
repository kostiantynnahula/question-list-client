'use client'
import { TestForm } from '@/components/TestForm/TestForm';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { redirect } from 'next/navigation';
import { Spinner } from '@/components/Layout/Spinner';

const EditPage = () => {

  const params = useParams();
  const session = useSession();
  if (!session.data?.user) {
    redirect('/');
  }

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
      {isLoading && <div className="text-center"><Spinner/></div>}
      {!isLoading && data && <TestForm test={data}/>}
    </div>
  );
}

export default EditPage;