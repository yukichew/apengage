import React from 'react';
import { FiSearch } from 'react-icons/fi';

const Searchbar = ({ name, id, value, placeholder, className, onChange }) => {
  return (
    <div className='w-full'>
      <div className='flex items-center'>
        <FiSearch
          size={20}
          className='absolute text-gray-400 pointer-events-none ml-3'
        />

        <input
          placeholder={placeholder}
          type='text'
          className={`w-full h-10 p-2 pl-12 rounded-lg ring-1 ring-gray-300 focus:ring-primary focus:outline-none font-poppins text-sm ${className}`}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Searchbar;
