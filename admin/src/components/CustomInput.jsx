import { useFormikContext } from 'formik';
import React from 'react';

const CustomInput = ({
  placeholder,
  required,
  id,
  name,
  type,
  icon: Icon = null,
  multiline = false,
  disabled = false,
  label = placeholder,
}) => {
  const { handleChange, values, errors, touched, handleBlur } =
    useFormikContext();
  const handleBlurWrapper = handleBlur(name);
  const value = values[name];
  const error = errors[name];
  const isInputTouched = touched[name];

  return (
    <div className='w-full'>
      <label for={id} className='block mb-2 text-sm font-medium text-gray-900'>
        {label}
      </label>
      <div className='relative flex items-center'>
        {Icon && (
          <Icon
            size={20}
            className='absolute text-gray-400 pointer-events-none ml-3'
          />
        )}
        {multiline ? (
          <textarea
            placeholder={placeholder}
            required={required}
            className={`w-full h-24 p-2 ${
              Icon ? 'pl-12' : ''
            } rounded-lg ring-1 ring-gray-300 focus:ring-primary focus:outline-none font-poppins text-sm ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            id={id}
            name={name}
            value={value}
            disabled={disabled}
            onBlur={handleBlurWrapper}
            onChange={handleChange(name)}
          />
        ) : (
          <input
            placeholder={placeholder}
            required={required}
            type={type}
            className={`w-full h-12 px-4 ${
              Icon ? 'pl-12' : ''
            } rounded-lg ring-1 ring-gray-300 focus:ring-primary-800 focus:border-primary-800 font-poppins text-sm ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            id={id}
            name={name}
            value={value}
            disabled={disabled}
            onBlur={handleBlurWrapper}
            onChange={handleChange(name)}
          />
        )}
      </div>
      {error && isInputTouched && (
        <span className='block mt-1 text-sm text-red-600 pl-1'>{error}</span>
      )}
    </div>
  );
};

export default CustomInput;
