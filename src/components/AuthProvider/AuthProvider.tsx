'use client'

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

type AuthProviderProps = {
  children: React.ReactNode;
  session: Session | null;
}

const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  return (
    <SessionProvider session={props.session}>{children}</SessionProvider>
  )
};

export default AuthProvider;