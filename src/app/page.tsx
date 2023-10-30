'use client'

import { LoginForm } from '@/components/LoginForm/LoginForm';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/Layout/Spinner';

const Home = () => {
  const { status, data } = useSession();

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Spinner/>
      </div>
    )
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

export default Home;
