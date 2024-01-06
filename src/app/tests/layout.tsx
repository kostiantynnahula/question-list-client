'use client'

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/Layout/Container';
import { ChildNodeProps } from '@/models/layout/models';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ucfirst } from '@/helpers/format.helper';
import { TestModal } from '@/components/TestForm/TestModal';
import Link from 'next/link';

export default function TestsLayout({
  children
}: ChildNodeProps) {

  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const session = useSession();

  if (session.status === 'unauthenticated') {
    redirect('/');
  }

  const isRootRoute = pathname === '/tests';

  const segments = pathname.split('/').filter(el => el);
  const [segment] = segments?.slice(-1) || '';

  const title = segments.length > 1 ? `${ucfirst(segment)} test` : `${ucfirst(segment)}`;

  const link = {
    title: isRootRoute ? 'Create' : 'Back',
    link: isRootRoute ? `${pathname}/create` : '/tests',
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isRootRoute) {
      e.preventDefault();
      setOpen(true);
    } 
  }

  return (
    <div>
      <header className="bg-white shadow">
        <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          {link && <div>
            <Link
              href={link.link}
              onClick={handleClick}
              className="cursor-pointer justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm"
            >{link.title}</Link>
          </div>}
        </div>
      </header>
      <Container>
        {children}
      </Container>
      <TestModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}