import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../components/common/CustomButton';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='font-poppins flex flex-col items-center justify-center min-h-screen px-6 mx-auto text-center'>
      <h2 className='mb-6 font-extrabold text-9xl text-gray-500'>
        <span className='sr-only'>Error</span>404
      </h2>
      <p className='text-xl font-semibold md:text-3xl mb-8 text-gray-400'>
        Sorry, we couldn't find this page.
      </p>
      <CustomButton
        title={'Back To Dashboard'}
        type={'button'}
        onClick={() => navigate('/dashboard')}
        className={'w-4/6 md:w-1/6'}
      />
    </div>
  );
};

export default NotFound;
