import { useFormikContext } from 'formik';
import React from 'react';

const CustomButton = ({
  title,
  type,
  onClick: handlePress,
  className,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  disabled = false,
}) => {
  const formikContext = useFormikContext();
  const handleClick = (event) => {
    if (type === 'submit') {
      if (formikContext?.isSubmitting) {
        event.preventDefault();
      } else if (handlePress) {
        handlePress(event);
      } else {
        formikContext?.handleSubmit();
      }
    } else if (handlePress) {
      handlePress(event);
    }
  };

  return (
    <div
      className={`w-full relative flex items-center justify-center font-medium font-poppins tracking-wide text-white ${className}`}
    >
      {LeftIcon && (
        <LeftIcon size={20} className='absolute left-4 pointer-events-none' />
      )}
      <button
        type={type}
        onClick={handleClick}
        className={`w-full h-12 transition duration-200 rounded-lg shadow-md ${
          disabled
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-primary-800 hover:bg-primary-950'
        }`}
        disabled={
          disabled || (type === 'submit' && formikContext?.isSubmitting)
        }
      >
        {title.toUpperCase()}
      </button>
      {RightIcon && (
        <RightIcon size={15} className='absolute right-4 pointer-events-none' />
      )}
    </div>
  );
};

export default CustomButton;
