import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { getProfile } from '../../api/auth';
import { updateAdmin } from '../../api/user';
import Breadcrumb from '../../components/common/BreadCrumb';
import CustomButton from '../../components/common/CustomButton';
import CustomFormik from '../../components/common/CustomFormik';
import Loader from '../../components/common/Loader';
import TextInput from '../../components/common/TextInput';
import Container from '../../components/Container';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    fullname: '',
  });
  const [id, setId] = useState('');

  const schema = yup.object().shape({
    fullname: yup.string().required('Name is required'),
  });

  useEffect(() => {
    setLoading(true);

    const fetchUser = async () => {
      const res = await getProfile();

      if (!res.success) {
        toast.error(res.error);
        navigate('/dashboard');
        return;
      }

      setInitialValues({
        fullname: res.admin.name,
      });

      setId(res.admin.id);

      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async (values, formikActions) => {
    const res = await updateAdmin(id, values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      return toast.error(res.error || 'Failed to save profile');
    }

    toast.success('Profile is updated successfully');
    navigate('/user/admins');
    formikActions.resetForm();
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <Breadcrumb pageName='Profile' backButton />

      <div className='bg-white rounded-lg shadow-lg'>
        <div className='p-10 space-y-4 md:space-y-5 sm:p-8'>
          <CustomFormik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
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

export default Profile;
