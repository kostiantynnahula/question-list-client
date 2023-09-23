import Link from 'next/link';

const Candidate = () => {
  const list = [
    {
      id: '1',
      fullName: 'fake full name',
      email: 'fakeemail@gmail.com'
    }
  ];

  return (
    <div>
      {list.map((candidate) => (
        <li key={candidate.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <Link href={`/candidates/${candidate.id}/edit`}>
                <p className="text-sm font-semibold leading-6 text-gray-900">{candidate.fullName}</p>
              </Link>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <div className="mt-1 flex items-center gap-x-1.5">
              <button
                // onClick={() => onDelete(test.id)}
                className="justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
              >Delete</button>
            </div>
          </div>
        </li>
      ))}
    </div>
  );
}

export default Candidate;