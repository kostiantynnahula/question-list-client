'use client'

import { InterviewForm } from '@/components/InterviewForm/InterviewForm';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { Spinner } from '@/components/Layout/Spinner';
import { InterviewFetcher } from '@/fetchers/interviews';
import { Interview } from '@/models/interviews/models';

const EditPage = () => {
  
  const params = useParams();
  const session = useSession();
  const token = session.data?.user.accessToken;
  const interviewFetcher = new InterviewFetcher<Interview>(token || '');

  const { data, isLoading } = useSWR({
    key: 'item',
    id: params.id,
    token,
  }, async () => {
    return token ? await interviewFetcher.interview(params.id as string) : undefined;
  });

  return (
    <>
      {isLoading && <Spinner/>}
      {!isLoading && data && <InterviewForm interview={data}/>}
    </>
  );
}

export default EditPage;