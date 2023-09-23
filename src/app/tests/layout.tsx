'use client'

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Utils/Header';
import { Container } from '@/components/Utils/Container';
import { ChildNodeProps } from '@/models/layout/models';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ucfirst } from '@/helpers/format.helper';

export default function TestsLayout({
  children
}: ChildNodeProps) {

  const pathname = usePathname();
  const session = useSession();

  if (session.status === 'unauthenticated') {
    redirect('/');
  }

  const isRootRoute = pathname === '/tests';

  const segments = pathname.split('/').filter(el => el);
  const [segment] = segments?.slice(-1) || '';

  const title = segments.length > 1 ? `${ucfirst(segment)} test` : `${ucfirst(segment)} list`;

  const link = {
    title: isRootRoute ? 'Create' : 'Back',
    link: isRootRoute ? `${pathname}/create` : '/tests',
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