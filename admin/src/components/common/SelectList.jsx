import { useField } from 'formik';
import React from 'react';
import { IoChevronDownOutline } from 'react-icons/io5';

const SelectList = ({ items, label, name }) => {
  const [field, meta] = useField(name);

  return (
    <div className='w-full'>
      <label className='block mb-2 text-sm font-medium text-gray-900'>
        {label}
      </label>

      <div className='relative flex items-center'>
        <select
          {...field}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          className={`w-full h-12 px-4 rounded-lg ring-1 ring-gray-300 focus:ring-primary-800 focus:border-primary-800 font-poppins text-sm appearance-none ${
            field.value ? 'text-black' : 'text-gray-400'
          }`}
        >
          <option value='' disabled>
            {label}
          </option>
          {items.map((item) => (
            <option
              key={item}
              value={item}
              className='text-body dark:text-bodydark'
            >
              {item}
            </option>
          ))}
        </select>

        <span className='absolute top-1/2 right-4 z-30 -translate-y-1/2'>
          <IoChevronDownOutline size={18} />
        </span>
      </div>

      {/* Show validation error if touched and error exist */}
      {meta.touched && meta.error ? (
        <div className='text-sm text-red-600'>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default SelectList;
