'use client'

import { TestForm } from '@/components/TestForm/TestForm';
import { Header } from '@/components/Utils/Header';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const CreateTest = () => {

  const session = useSession();

  if (!session.data?.user) {
    redirect('/');
  }

  return (
    <div>
      <TestForm/>
    </div>
  );
}

export default CreateTest;