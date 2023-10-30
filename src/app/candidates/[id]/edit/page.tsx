'use client'

import { CandidateForm } from '@/components/Candidate/CandidateForm';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { CandidateFetcher } from '@/fetchers/candidates';
import { Candidate } from '@/models/candidates/models';
import { Spinner } from '@/components/Layout/Spinner';

const EditPage = () => {

  const params = useParams();
  const session = useSession();
  const token = session.data?.user.accessToken || '';
  const candidateFetcher = new CandidateFetcher<Candidate>(token);

  const { data, isLoading } = useSWR({
    key: 'item',
    id: params.id,
    token
  }, async () => {
    return await candidateFetcher.candidate(params.id as string);
  });

  return (
    <div>
      {isLoading && <Spinner/>}
      {!isLoading && data && <CandidateForm candidate={data}/>}
    </div>
  );
}

export default EditPage;