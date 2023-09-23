'use client'

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Utils/Header';
import { Container } from '@/components/Utils/Container';
import { ChildNodeProps } from '@/models/layout/models';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function TestsLayout({
  children
}: ChildNodeProps) {

  const pathname = usePathname();
  const session = useSession();

  if (session.status === 'unauthenticated') {
    redirect('/');
  }

  const isRootRoute = pathname === '/tests';
  const title = `${isRootRoute ? 'Create' : 'Edit'} Test`;
  const link = {
    title: isRootRoute ? 'Create' : 'Back',
    link: `${pathname}${isRootRoute ? '/create' : ''}`
  };

  return (
    <div>
      <Header
        title={title}
        link={link}
      />
      <Container>
        {children}
      </Container>
    </div>
  );
}