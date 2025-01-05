import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { changePassword } from '../../api/auth';
import Breadcrumb from '../../components/common/BreadCrumb';
import CustomButton from '../../components/common/CustomButton';
import CustomFormik from '../../components/common/CustomFormik';
import TextInput from '../../components/common/TextInput';
import Container from '../../components/Container';

const ChangePassword = () => {
  const navigate = useNavigate();
  const initialValues = {
    password: '',
  };

  const schema = yup.object().shape({
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
    const res = await changePassword(values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    navigate('/dashboard');
    formikActions.resetForm();
  };

  return (
    <Container>
      <Breadcrumb pageName='Change Password' backButton />

      <div className='bg-white rounded-lg shadow-lg'>
        <div className='p-10 space-y-4 md:space-y-5 sm:p-8'>
          <CustomFormik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            <TextInput
              id={'password'}
              name={'password'}
              placeholder={'New Password'}
              type={'password'}
              required
            />
            <CustomButton title='save' type='submit' />
          </CustomFormik>
        </div>
      </div>
    </Container>
  );
};

export default ChangePassword;
