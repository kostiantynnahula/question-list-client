'use client'

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { listFetcher, deleteItem } from '@/fetchers/interviews';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/Layout/Spinner';
import { Modal } from '@/components/Modal/Modal';
import { SuccessAlert } from '@/components/Layout/Alert';

const Interviews = () => {

  const [alert, setAlert] = useState<string>();
  const [deleteId, setDeleteId] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();
  const sessionToken = session.data?.user.accessToken;

  const { data, isLoading, mutate } = useSWR({
    key: 'interviews',
    token: sessionToken,
  }, listFetcher);

  const onDelete = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  }

  const onCloseModal = () => {
    setDeleteId(undefined);
    setOpen(false);
  }

  const handleDelete = async () => {
    if (deleteId && sessionToken) {
      const response = await deleteItem(deleteId, sessionToken);

      if (response.status === 200) {
        setAlert('Interview was deleted successfully');
      } else {
        // const message = response.message || 'Something went wrong'; 
        // setAlert(message);
      }
    }

    setDeleteId(undefined);
    setOpen(false);
    mutate();
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
      {data && <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Candidate full name
              </th>
              <th scope="col" className="px-6 py-3">
                Candidate email
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
            {!isLoading && data && data?.map(interview => (
              <tr key={interview.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <Link 
                    href={`/interviews/${interview.id}/edit`}
                    className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                  >
                    {interview.name}
                  </Link>
                </th>
                <td className="px-6 py-4">
                  {interview.candidate.fullName}
                </td>
                <td className="px-6 py-4">
                  {interview.candidate.email}
                </td>
                <td className="px-6 py-4">
                  {new Date(interview.createdAt).toISOString()}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/interviews/${interview.id}/start`}
                    className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                  >
                    Start
                  </Link>
                  <button 
                    onClick={() => onDelete(interview.id)}
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
      }
      <Modal
        title="Delete a interview"
        content="Are you sure that you want to delete this interview?"
        open={open}
        onClose={onCloseModal}
        onSubmit={handleDelete}
      />
    </div>
  );
}

export default Interviews;