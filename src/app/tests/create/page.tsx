'yse client'

import { TestForm } from '@/components/TestForm/TestForm';
import { Header } from '@/components/TestForm/TestHeader';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const CreateTest = () => {

  const session = useSession();

  if (!session.data?.user) {
    redirect('/');
  }

  return (
    <div>
      <Header title='New test'/>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <TestForm/>
        </div>
      </main>
  </div>
  );
}

export default CreateTest;