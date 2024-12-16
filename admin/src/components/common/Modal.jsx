import React from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = ({ isVisible, onClose, children, className, backButton }) => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black bg-opacity-55 flex justify-center items-center font-poppins'>
      <div className={`bg-white rounded-lg shadow-lg p-6 w-auto ${className}`}>
        <div className='flex items-center'>
          {backButton}
          <IoClose
            size={25}
            className='cursor-pointer text-gray-400 hover:text-gray-800 ml-auto'
            onClick={onClose}
            aria-label='Close'
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
