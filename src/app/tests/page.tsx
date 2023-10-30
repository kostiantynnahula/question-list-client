'use client'

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { AlertState, Alert } from '@/components/Alert/Alert';
import { Modal } from '@/components/Modal/Modal';
import { Spinner } from '@/components/Layout/Spinner';

const Tests = () => {

  const [alert, setAlert] = useState<AlertState>();
  const [open, setOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>();
  const session = useSession();
  const fetcher = async (params: { url: string, token: string, method?: string }) => {
    const path = `${process.env.NEXT_PUBLIC_API_PATH}${params.url}`;
    
    const response = await fetch(path, {
      method: params.method || 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${params.token}`
      }
    });

    return response.json();
  }

  const { data, isLoading, mutate } = useSWR({
    url: '/tests',
    token: session.data?.user.accessToken
  }, fetcher);

  const handleDelete = async () => {
    const path = `${process.env.NEXT_PUBLIC_API_PATH}/tests/${deleteId}`;
    
    const response = await fetch(path, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${session.data?.user.accessToken}`
      }
    });

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
      <ul role="list" className="divide-y divide-gray-100">
        {isLoading && <div className="text-center"><Spinner/></div>}
        {!isLoading && data.length && data.map((test: any) => (
          <li key={test.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <Link href={`/tests/${test.id}/edit`}>
                  <p className="text-sm font-semibold leading-6 text-gray-900">{test.name}</p>
                </Link>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <div className="mt-1 flex items-center gap-x-1.5">
                <button
                  onClick={() => onDelete(test.id)}
                  className="justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
                >Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tests