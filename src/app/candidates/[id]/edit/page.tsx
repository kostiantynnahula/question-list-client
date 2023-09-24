'use client'

import { CandidateForm } from '@/components/Candidate/CandidateForm';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { itemFetcher } from '@/fetchers/candidates';
import { Spinner } from '@/components/Layout/Spinner';

const EditPage = () => {

  const params = useParams();
  const session = useSession();
  const token = session.data?.user.accessToken;

  const { data, isLoading } = useSWR({
    key: 'item',
    id: params.id,
    token
  }, itemFetcher);

  return (
    <div>
      {isLoading && <Spinner/>}
      {!isLoading && data && <CandidateForm candidate={data}/>}
    </div>
  );
}

export default EditPage;