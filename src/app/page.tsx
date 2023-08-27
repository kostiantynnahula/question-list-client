'use client'

import { LoginForm } from '@/components/LoginForm/LoginForm';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { status, data } = useSession();

  if (status === 'loading') {
    return <>Loading...</>
  }

  if (status === 'unauthenticated') {
    return <LoginForm/>;
  }

  return (
    <>
      <Dashboard/>
    </>
  )
}
