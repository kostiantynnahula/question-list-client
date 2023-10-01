'use client'

import { InterviewForm } from '@/components/InterviewForm/InterviewForm';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { Spinner } from '@/components/Layout/Spinner';
import { itemFetcher } from '@/fetchers/interviews';

const EditPage = () => {
  
  const params = useParams();
  const session = useSession();
  const token = session.data?.user.accessToken;

  const { data, isLoading } = useSWR({
    key: 'item',
    id: params.id,
    token,
  }, itemFetcher);

  return (
    <>
      {isLoading && <Spinner/>}
      {!isLoading && data && <InterviewForm interview={data}/>}
    </>
  );
}

export default EditPage;