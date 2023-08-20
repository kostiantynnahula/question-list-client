'use client'

import { LoginForm } from '@/components/LoginForm/LoginForm';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { useSession } from 'next-auth/react';

export default function Home() {
  const session = useSession();

  console.log(session);

  const auth = false;
  return (
    <>
      {auth ? <Dashboard/> : <LoginForm/>}
    </>
  )
}
