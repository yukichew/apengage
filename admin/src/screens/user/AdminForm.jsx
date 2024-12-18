import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { addAdmin, getUser, updateAdmin } from '../../api/user';
import Breadcrumb from '../../components/common/BreadCrumb';
import CustomButton from '../../components/common/CustomButton';
import CustomFormik from '../../components/common/CustomFormik';
import Loader from '../../components/common/Loader';
import TextInput from '../../components/common/TextInput';
import Container from '../../components/Container';

const AdminForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isEditMode = !!id;
  const [initialValues, setInitialValues] = useState({
    fullname: '',
    email: '',
  });

  const schema = yup.object().shape({
    fullname: yup.string().required('Name is required'),
    email: yup.string().email().required('Email is required'),
  });

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchUser = async () => {
        const res = await getUser(id);
        if (!res.success) {
          toast.error(res.error);
          navigate('/user/admins');
          return;
        }
        setInitialValues(res.user);
        setLoading(false);
      };
      fetchUser();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (values, formikActions) => {
    const payload = isEditMode ? { fullname: values.fullname } : values;

    const res = isEditMode
      ? await updateAdmin(id, payload)
      : await addAdmin(payload);
    formikActions.setSubmitting(false);

    if (!res.success) {
      return toast.error(res.error || 'Failed to save admin');
    }

    toast.success(`Admin ${isEditMode ? 'updated' : 'added'} successfully`);
    navigate('/user/admins');
    formikActions.resetForm();
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <Breadcrumb
        pageName={isEditMode ? 'Edit Admin' : 'Add Admin'}
        backButton
      />

      <div className='bg-white rounded-lg shadow-lg'>
        <div className='p-10 space-y-4 md:space-y-5 sm:p-8'>
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
              disabled={isEditMode}
            />
            <TextInput
              id={'fullname'}
              name={'fullname'}
              placeholder={'Name'}
              type={'text'}
              required
            />
            <CustomButton title='save' type='submit' />
          </CustomFormik>
        </div>
      </div>
    </Container>
  );
};

export default AdminForm;
