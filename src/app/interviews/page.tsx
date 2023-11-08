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
import { Pagination } from '@/components/Pagination/Pagination';
import { PaginationQuery } from '@/components/Pagination/models';

const Interviews = () => {

  const [pagination, setPagination] = useState<PaginationQuery>({
    page: 0,
    search: ''
  });
  const limit = 10;
  const [alert, setAlert] = useState<string>();
  const [deleteId, setDeleteId] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const session = useSession();
  const token = session.data?.user.accessToken;

  const debouncedSearch = useDebounce(pagination.search, 700);

  const interviewFetcher = new InterviewFetcher<Interview>(token || '');

  const { data, isLoading, mutate } = useSWR({ 
    key: `interviews`,
    token,
    search: debouncedSearch
  }, async () => {
    return await interviewFetcher.interviews({
      search: debouncedSearch, 
      skip: pagination.page * limit 
    }) as unknown as PaginationResponse<Interview>;
  });

  const list = data?.list, total = data?.total || 0;

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
    setPagination({ ...pagination, search: value });
  }

  const onChangePage = (value: number) => {
    const page = value < 0 ? 0 : value;
    setPagination({ ...pagination, page });
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
              value={pagination.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 w-1/4">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 w-1/4">
                  Candidate full name
                </th>
                <th scope="col" className="px-6 py-3 w-1/5">
                  Candidate email
                </th>
                <th scope="col" className="px-6 py-3">
                  Create at
                </th>
                <th scope="col" className="px-6 py-3 text-center w-60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && list && list?.map(interview => (
                <tr key={interview.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/4">
                    <Link 
                      href={`/interviews/${interview.id}/edit`}
                      className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                    >
                      {interview.name}
                    </Link>
                  </th>
                  <td className="px-6 py-4 w-1/4">
                    {interview.candidate.fullName}
                  </td>
                  <td className="px-6 py-4 w-1/5">
                    {interview.candidate.email}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(interview.createdAt).toISOString()}
                  </td>
                  <td className="px-6 py-4 text-center w-60">
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
            <Pagination
              page={pagination.page}
              limit={limit}
              total={total}
              length={list.length}
              onChangePage={onChangePage}
            />
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