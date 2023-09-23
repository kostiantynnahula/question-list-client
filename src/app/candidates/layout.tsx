'use client'

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Utils/Header';
import { Container } from '@/components/Utils/Container';
import { ChildNodeProps } from '@/models/layout/models';

const CandidatesLayout = ({
  children
}: ChildNodeProps) => {
  const pathname = usePathname();

  const isRootRoute = pathname === '/candidates';

  const title = `${isRootRoute ? 'Create' : 'Edit'} Candidate`;

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

export default CandidatesLayout;