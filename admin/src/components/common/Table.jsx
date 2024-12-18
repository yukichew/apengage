import React, { useState } from 'react';
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import { GiCheckMark } from 'react-icons/gi';
import { RiCloseLargeFill } from 'react-icons/ri';
import { RxLockClosed, RxLockOpen2 } from 'react-icons/rx';
import { formatDateTime } from '../../utils/formatDate';

const Table = ({
  data,
  columns,
  columnKeys,
  actions = ['view', 'edit', 'delete', 'activate', 'deactivate'],
  handleAction,
  totalRows,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const maxVisiblePages = 3;

    let startPage, endPage;
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfMaxVisible = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, currentPage - halfMaxVisible);
      endPage = Math.min(totalPages, currentPage + halfMaxVisible);

      if (startPage === 1) {
        endPage = maxVisiblePages;
      } else if (endPage === totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
      }
    }

    return (
      <div className='flex justify-between items-center mt-2'>
        <div className='flex space-x-2'>
          {/* previous */}
          <button
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {'<'}
          </button>

          {/* page number */}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageNum = startPage + i;
            return (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded border font-medium ${
                  currentPage === pageNum
                    ? 'bg-primary-800 text-white'
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          {/* next */}
          <button
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {'>'}
          </button>
        </div>
      </div>
    );
  };

  const currentRows = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
      case 'Approved':
        return 'bg-green-100 text-green-600 rounded-full px-3 py-1';
      case 'Inactive':
      case 'Rejected':
        return 'bg-red-100 text-red-600 rounded-full px-3 py-1';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600 rounded-full px-3 py-1';
      default:
        return 'bg-gray-100 text-gray-600 rounded-full px-3 py-1';
    }
  };

  return (
    <div className='w-full mx-auto'>
      <table className='min-w-full table-auto rounded-lg border-y border-gray-200'>
        <thead className=''>
          <tr>
            {/* index column */}
            <th className='px-4 py-2 text-center text-base border-y font-semibold w-12'>
              No.
            </th>
            {columns.map((col, index) => (
              <th
                key={index}
                className='px-4 py-2 text-left text-base border-y font-semibold'
              >
                {col}
              </th>
            ))}
            <th className='px-4 py-2 text-center text-base border-y font-semibold w-40'>
              Created At
            </th>
            {data.some((row) => row.updatedAt) && (
              <th className='px-4 py-2 text-center text-base border-y font-semibold w-40'>
                Updated At
              </th>
            )}
            <th className='px-4 py-2 text-center text-base border-y font-semibold w-30'>
              Status
            </th>
            <th className='px-4 py-2 text-center text-base border-y font-semibold w-28'>
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index} className='hover:bg-gray-50'>
              {/* index column */}
              <td className='px-4 py-2 text-sm text-center text-gray-600 border-y'>
                {(currentPage - 1) * rowsPerPage + index + 1}
              </td>
              {columnKeys.map((key, colIndex) => (
                <td
                  key={colIndex}
                  className='px-4 py-2 text-sm text-left text-gray-600 border-y'
                >
                  {row[key]}
                </td>
              ))}

              {/* createdAt column */}
              <td className='px-4 py-2 text-sm text-center border-y'>
                {formatDateTime(row.createdAt)}
              </td>

              {/* updatedAt column */}
              {row.updatedAt && (
                <td className='px-4 py-2 text-sm text-center border-y'>
                  {formatDateTime(row.updatedAt)}
                </td>
              )}

              {/* status column */}
              <td className='px-4 py-2 text-sm text-center border-y'>
                <span
                  className={`${getStatusClass(
                    row.status
                  )} inline-block text-sm`}
                >
                  {row.status}
                </span>
              </td>

              {/* action column */}
              <td className='px-4 py-2 text-center text-sm text-gray-400 border-y font-poppins'>
                <div className='flex items-center justify-center space-x-3'>
                  {actions.includes('view') && (
                    <div className='relative group'>
                      <FiEye
                        className='cursor-pointer hover:text-gray-800'
                        onClick={() => handleAction('view', row)}
                      />
                      <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-600 text-white text-xs rounded py-1 px-2'>
                        Details
                      </span>
                    </div>
                  )}
                  {actions.includes('edit') && (
                    <div className='relative group'>
                      <FiEdit2
                        className='cursor-pointer hover:text-gray-800'
                        onClick={() => handleAction('edit', row)}
                      />
                      <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-600 text-white text-xs rounded py-1 px-2'>
                        Edit
                      </span>
                    </div>
                  )}
                  {actions.includes('delete') && (
                    <div className='relative group'>
                      <FiTrash2
                        className='cursor-pointer hover:text-gray-800'
                        onClick={() => handleAction('delete', row)}
                      />
                      <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-600 text-white text-xs rounded py-1 px-2'>
                        Delete
                      </span>
                    </div>
                  )}
                  {actions.includes('activate') && row.status !== 'Active' && (
                    <div className='relative group'>
                      <RxLockOpen2
                        className='cursor-pointer hover:text-gray-800'
                        onClick={() => handleAction('activate', row)}
                      />
                      <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-600 text-white text-xs rounded py-1 px-2'>
                        Activate
                      </span>
                    </div>
                  )}
                  {actions.includes('deactivate') &&
                    row.status !== 'Inactive' && (
                      <div className='relative group'>
                        <RxLockClosed
                          className='cursor-pointer hover:text-gray-800'
                          onClick={() => handleAction('deactivate', row)}
                        />
                        <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-600 text-white text-xs rounded py-1 px-2'>
                          Deactivate
                        </span>
                      </div>
                    )}
                  {actions.includes('approve') && row.status === 'Pending' && (
                    <div className='relative group'>
                      <GiCheckMark
                        className='cursor-pointer hover:text-gray-800'
                        onClick={() => handleAction('approve', row)}
                      />
                      <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-600 text-white text-xs rounded py-1 px-2'>
                        Approve
                      </span>
                    </div>
                  )}
                  {actions.includes('reject') && row.status === 'Pending' && (
                    <div className='relative group'>
                      <RiCloseLargeFill
                        className='cursor-pointer hover:text-gray-800'
                        onClick={() => handleAction('reject', row)}
                      />
                      <span className='absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-600 text-white text-xs rounded py-1 px-2'>
                        Reject
                      </span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-between items-center mt-4'>
        <div className='text-sm text-gray-600'>
          Showing {currentRows.length} of {totalRows}
        </div>
        <div className='flex space-x-2'>{renderPagination()}</div>
      </div>
    </div>
  );
};

export default Table;
