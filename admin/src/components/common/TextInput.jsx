import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const TextInput = ({
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
  const [showPassword, setShowPassword] = useState(false);
  const handleBlurWrapper = handleBlur(name);
  const value = values[name];
  const error = errors[name];
  const isInputTouched = touched[name];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='w-full'>
      <label
        htmlFor={id}
        className='block mb-2 text-sm font-medium text-gray-900'
      >
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
            type={showPassword && type === 'password' ? 'text' : type}
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
        {type === 'password' && (
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute right-3 text-gray-400'
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>
      {error && isInputTouched && (
        <span className='block mt-1 text-sm text-red-600 pl-1'>{error}</span>
      )}
    </div>
  );
};

export default TextInput;
