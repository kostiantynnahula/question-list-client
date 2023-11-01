'use client'
import { TestForm } from '@/components/TestForm/TestForm';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { redirect } from 'next/navigation';
import { Spinner } from '@/components/Layout/Spinner';
import { TestFetcher } from '@/fetchers/tests';
import { Test } from '@/models/tests/models';

const EditPage = () => {

  const params = useParams();
  const testId = params.id as string;
  const session = useSession({ required: true });
  const token = session.data?.user.accessToken || '';
  const testFetcher = new TestFetcher<Test>(token);

  const { data, isLoading } = useSWR({
    url: `/tests/${params.id}`,
    token: session.data?.user.accessToken,
    id: params.id,
  }, async () => await testFetcher.test(testId));

  return (
    <div>
      {isLoading && <div className="text-center"><Spinner/></div>}
      {!isLoading && data && <TestForm test={data}/>}
    </div>
  );
}

export default EditPage;