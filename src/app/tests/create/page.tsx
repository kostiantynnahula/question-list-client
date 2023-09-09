import Link from 'next/link';
import { TestForm } from '@/components/TestForm/TestForm';

const CreateTest = () => {
  return (
    <div>
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">New test</h1>
        <div>
          <Link
            href="/tests"
            className='justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm'
          >Back</Link>
        </div>
      </div>
    </header>
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <TestForm/>
      </div>
    </main>
  </div>
  );
}

export default CreateTest;