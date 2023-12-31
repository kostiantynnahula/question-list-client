'use client'

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { AlertState, Alert } from '@/components/Alert/Alert';
import { Modal } from '@/components/Modal/Modal';
import { Spinner } from '@/components/Layout/Spinner';
import { TestFetcher } from '@/fetchers/tests';
import { Test } from '@/models/tests/models';

const Tests = () => {

  const [alert, setAlert] = useState<AlertState>();
  const [open, setOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>();
  const session = useSession();
  const token = session.data?.user.accessToken || '';
  const testFetcher = new TestFetcher<Test>(token);

  const { data = [], isLoading, mutate } = useSWR({
    url: '/tests',
    token: session.data?.user.accessToken
  }, async () => {
    return await testFetcher.tests();
  });

  const handleDelete = async () => {
    
    if (!deleteId) return;

    const response = await testFetcher.delete(deleteId)

    const responseData = await response.json();

    if (response.status === 200) {
      setAlert({
        type: 'success',
        message: 'Test was deleted successful',
      });
    } else {
      const message = responseData.message || 'Something went wrong';
      setAlert({
        type: 'error',
        message
      });
    }
    setOpen(false);
    setDeleteId(undefined);
    mutate();
  }

  const onDelete = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  }

  const onCloseModal = () => {
    setOpen(false);
    setDeleteId(undefined);
  }

  return (
    <div>
      <Modal
        title="Delete a test"
        content="Are you sure that you want to delete this test?"
        open={open}
        onClose={onCloseModal}
        onSubmit={handleDelete}
      />
      {alert && <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(undefined)}
      />}
      {isLoading && <div className="text-center"><Spinner/></div>}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Type
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
            {!isLoading && data && data?.map(test => (
              <tr key={test.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <Link
                    href={`/tests/${test.id}/edit`}
                    className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                  >
                    {test.name}
                  </Link>
                </th>
                <td className="px-6 py-4">
                  {test.isTemplate ? 'Template' : 'Test'}
                </td>
                <td className="px-6 py-4">
                  {test.createdAt ? new Date(test.createdAt).toISOString() : ''}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(test.id)}
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
    </div>
  );
}

export default Tests