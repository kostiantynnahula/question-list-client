'use client'

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Container } from '@/components/Layout/Container';
import { ChildNodeProps } from '@/models/layout/models';
import { ucfirst } from '@/helpers/format.helper';

const CandidatesLayout = ({
  children
}: ChildNodeProps) => {
  const pathname = usePathname();

  const isRootRoute = pathname === '/candidates';

  const segments = pathname.split('/').filter(el => el);
  const [segment] = segments?.slice(-1) || '';

  const title = segments.length > 1 ? `${ucfirst(segment)} candidate` : `${ucfirst(segment)} list`;

  const link = {
    title: isRootRoute ? 'Create' : 'Back',
    link: isRootRoute ? `${pathname}/create` : '/candidates'
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

export default CandidatesLayout;