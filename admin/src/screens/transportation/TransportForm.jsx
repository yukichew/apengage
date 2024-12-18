import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
  addTransport,
  getTransport,
  updateTransport,
} from '../../api/transport';
import Breadcrumb from '../../components/common/BreadCrumb';
import CustomButton from '../../components/common/CustomButton';
import CustomFormik from '../../components/common/CustomFormik';
import Loader from '../../components/common/Loader';
import SelectList from '../../components/common/SelectList';
import TextInput from '../../components/common/TextInput';
import Container from '../../components/Container';

const TransportForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isEditMode = !!id;
  const [initialValues, setInitialValues] = useState({
    name: '',
    type: '',
    capacity: '',
  });

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    type: yup.string().required('Type is required'),
    capacity: yup.number().required('Capacity is required'),
  });

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchTransport = async () => {
        const res = await getTransport(id);
        if (!res.success) {
          toast.error(res.error);
          navigate('/logistics/transport');
          return;
        }
        setInitialValues(res.transport);
        setLoading(false);
      };
      fetchTransport();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (values, formikActions) => {
    const res = isEditMode
      ? await updateTransport(id, values)
      : await addTransport(values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      return toast.error(res.error || 'Failed to save transport');
    }

    toast.success(`Transport ${isEditMode ? 'updated' : 'added'} successfully`);
    navigate('/logistics/transport');
    formikActions.resetForm();
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <Breadcrumb
        pageName={isEditMode ? 'Edit Tranport' : 'Add Tranport'}
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
              id={'name'}
              name={'name'}
              placeholder={'Car Plate'}
              type={'text'}
              required
            />
            <SelectList label='Type' name='type' items={['Bus', 'Van']} />
            <TextInput
              id={'capacity'}
              name={'capacity'}
              placeholder={'capacity'}
              type={'number'}
              required
            />
            <CustomButton title='save' type='submit' />
          </CustomFormik>
        </div>
      </div>
    </Container>
  );
};

export default TransportForm;
