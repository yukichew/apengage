import React from 'react';
import CustomButton from './CustomButton';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
  <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
    <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
      <h2 className='text-lg font-bold mb-4'>{title}</h2>
      <p className='mb-6'>{message}</p>
      <div className='flex justify-end space-x-4'>
        <button
          onClick={onCancel}
          className='px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400'
        >
          Cancel
        </button>
        <CustomButton title='Confirm' onClick={onConfirm} className='w-24' />
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
