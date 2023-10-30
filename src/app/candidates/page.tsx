'use client'
import Link from 'next/link';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/Layout/Spinner';
import { SuccessAlert } from '@/components/Layout/Alert';
import { useState } from 'react';
import { Modal } from '@/components/Modal/Modal';
import { CandidateFetcher } from '@/fetchers/candidates';
import { Candidate } from '@/models/candidates/models';

const Candidate = () => {
  
  const [alert, setAlert] = useState<string>();
  const [deleteId, setDeleteId] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();
  const sessionToken = session.data?.user.accessToken || '';
  const candidateFetcer = new CandidateFetcher<Candidate>(sessionToken);

  const { data, isLoading, mutate } = useSWR({
    key: 'list',
    token: sessionToken,
  }, async () => {
    return await candidateFetcer.candidates();
  });

  const handleDelete = async () => {
    if (deleteId && sessionToken) {
      const response = await candidateFetcer.delete(deleteId);

      if (response.status === 200) {
        setAlert('Candidate was deleted successfully');
      } else {
        // const message = response.message || 'Something went wrong'; 
        // setAlert(message);
      }
    }

    setDeleteId(undefined);
    setOpen(false);
    mutate();
  }

  const onDelete = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  }

  const onCloseModal = () => {
    setDeleteId(undefined);
    setOpen(false);
  }

  return (
    <div>
      {alert && 
        <SuccessAlert
          content={alert}
          onClose={() => setAlert(undefined)}
        />
      }

      {isLoading && 
        <div className="text-center">
          <Spinner/>
        </div>
      }
    
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Create at
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && data && data?.map(candidate => (
              <tr key={candidate.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <Link 
                    href={`/candidates/${candidate.id}/edit`}
                    className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                  >
                    {candidate.fullName}
                  </Link>
                </th>
                <td className="px-6 py-4">
                  {candidate.email}
                </td>
                <td className="px-6 py-4">
                  {candidate.createdAt ? new Date(candidate.createdAt).toISOString() : ''}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => onDelete(candidate.id)}
                    type="button" 
                    className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        title="Delete a candidate"
        content="Are you sure that you want to delete this candidate?"
        open={open}
        onClose={onCloseModal}
        onSubmit={handleDelete}
      />
    </div>
  );
}

export default Candidate;