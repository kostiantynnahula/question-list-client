'use client'

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { Container } from '@/components/Layout/Container';
import { ChildNodeProps } from '@/models/layout/models';
import { ucfirst } from '@/helpers/format.helper';

const InterviewsLayout = ({ children }: ChildNodeProps) => {

  const pathname = usePathname();

  const isRootRoute = pathname === '/interviews';

  const segments = pathname.split('/').filter(el => el);
  const [segment] = segments?.slice(-1) || '';

  const title = segments.length > 1 ? `${ucfirst(segment)} interview` : `${ucfirst(segment)} list`;

  const link = {
    title: isRootRoute ? 'Create' : 'Back',
    link: isRootRoute ? `${pathname}/create` : '/interviews'
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

export default InterviewsLayout;