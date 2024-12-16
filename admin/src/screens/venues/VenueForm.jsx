import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { addVenue, getVenue, updateVenue } from '../../api/venue';
import Breadcrumb from '../../components/common/BreadCrumb';
import CustomButton from '../../components/common/CustomButton';
import CustomFormik from '../../components/common/CustomFormik';
import SelectList from '../../components/common/SelectList';
import TextInput from '../../components/common/TextInput';
import Container from '../../components/Container';

const VenueForm = () => {
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
      const fetchVenue = async () => {
        const res = await getVenue(id);
        if (!res.success) {
          toast.error(res.error);
          navigate('/logistics/venue');
          return;
        }
        setInitialValues(res.venue);
        setLoading(false);
      };
      fetchVenue();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (values, formikActions) => {
    const res = isEditMode
      ? await updateVenue(id, values)
      : await addVenue(values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      return toast.error(res.error || 'Failed to save venue');
    }

    toast.success(`Venue ${isEditMode ? 'updated' : 'added'} successfully`);
    navigate('/logistics/venue');
    formikActions.resetForm();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container>
      <Breadcrumb pageName='Add Venue' backButton />

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
              placeholder={'Name'}
              type={'text'}
              required
            />
            <SelectList
              label='Type'
              name='type'
              items={['Auditorium', 'Room', 'Other']}
            />
            <TextInput
              id={'capacity'}
              name={'capacity'}
              placeholder={'Capacity'}
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

export default VenueForm;
