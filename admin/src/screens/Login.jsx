import React from 'react';
import { IoKeyOutline } from 'react-icons/io5';
import { TfiEmail } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { login } from '../api/auth';
import logo from '../assets/logo.svg';
import CustomButton from '../components/common/CustomButton';
import CustomFormik from '../components/common/CustomFormik';
import TextInput from '../components/common/TextInput';

const Login = () => {
  const navigate = useNavigate();
  const initialValues = {
    email: '',
    password: '',
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[^a-zA-Z0-9]/,
        'Password must contain at least one special character (e.g., !, @, #)'
      )
      .required('Password is required'),
  });

  const handleSubmit = async (values, formikActions) => {
    const res = await login(values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success('Login successful');

    navigate('/dashboard');
    formikActions.resetForm();
  };

  return (
    <div className='bg-gray-100 font-poppins'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen'>
        <img className='w-40 flex items-center mb-5' src={logo} alt='logo' />

        {/* login form */}
        <div className='w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-10 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
              Admin Login
            </h1>

            <CustomFormik
              initialValues={initialValues}
              validationSchema={schema}
              onSubmit={handleSubmit}
            >
              <TextInput
                id={'email'}
                name={'email'}
                placeholder={'Email'}
                type={'text'}
                required
                icon={TfiEmail}
              />
              <TextInput
                id={'password'}
                name={'password'}
                placeholder={'********'}
                type={'password'}
                label={'Password'}
                required
                icon={IoKeyOutline}
              />
              <CustomButton title='login' type='submit' />
            </CustomFormik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
