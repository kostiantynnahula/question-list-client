'use client'

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { InterviewFetcher } from '@/fetchers/interviews';
import { useSession } from 'next-auth/react';
import { Spinner } from '@/components/Layout/Spinner';
import { Modal } from '@/components/Modal/Modal';
import { SuccessAlert } from '@/components/Layout/Alert';
import { Interview } from '@/models/interviews/models';
import { InterviewStatus } from '@/models/interviews/models';
import { blueOutlineBtn } from '@/consts/styles/button';
import { useDebounce } from '@/hooks/debounce';
import { PaginationResponse } from '@/models/http/requests';

const Interviews = () => {

  const [search, setSearch] = useState<string>('');
  const [alert, setAlert] = useState<string>();
  const [deleteId, setDeleteId] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();
  const token = session.data?.user.accessToken;

  const debouncedSearch = useDebounce(search, 700);

  const interviewFetcher = new InterviewFetcher<Interview>(token || '');

  const { data, isLoading, mutate } = useSWR({ key: 'interviews', token, search: debouncedSearch }, async () => {
    return await interviewFetcher.interviews(debouncedSearch) as unknown as PaginationResponse<Interview>;
  });

  const list = data?.list, total = data?.total;

  const onDelete = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  }

  const onCloseModal = () => {
    setDeleteId(undefined);
    setOpen(false);
  }

  const handleDelete = async () => {
    if (deleteId && token) {
      const response = await interviewFetcher.delete(deleteId);

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

  const handleSearch = (value: string) => {
    setSearch(value);
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
      {list &&
        <div>
          <div className="mb-4 w-1/3">
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
              {!isLoading && list && list?.map(interview => (
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
                      href={`/interviews/${interview.id}/${interview.status === InterviewStatus.COMPLETED ? 'result' : 'start'}`}
                      className={blueOutlineBtn}
                    >
                      {interview.status === InterviewStatus.COMPLETED ? 'Result' : 'Start'}
                    </Link>
                    <button 
                      onClick={() => onDelete(interview.id)}
                      type="button" 
                      className={blueOutlineBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-700 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">1 </span> 
                  to <span className="font-semibold text-gray-900 dark:text-white"> 10</span> of 
                  <span className="font-semibold text-gray-900 dark:text-white"> 100</span> Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Prev</button>
                <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Next</button>
              </div>
            </div>
          </div>
        </div>
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