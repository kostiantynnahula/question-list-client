import { PaginationProps } from '@/components/Pagination/models';

export const Pagination = ({
  page,
  limit,
  total,
  length,
  onChangePage,
}: PaginationProps) => {
  return (
    <div className="flex justify-between">
      <div>
        <span className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{(page * limit) + 1} </span> 
            to <span className="font-semibold text-gray-900 dark:text-white">{(page * limit) + length}</span> of 
            <span className="font-semibold text-gray-900 dark:text-white"> {total}</span> Entries
        </span>
      </div>
      <div className="inline-flex xs:mt-0">
        <button 
          type="button"
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          onClick={() => onChangePage(page - 1)}
        >Prev</button>
        <button 
          type="button"
          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          onClick={() => onChangePage(page + 1)}
        >Next</button>
      </div>
    </div>
  );
};