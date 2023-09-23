import { ChildNodeProps } from '@/models/layout/models';

export const Container = ({
  children
}: ChildNodeProps) => {
  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}