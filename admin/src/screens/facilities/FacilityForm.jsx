import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { addFacility, getFacility, updateFacility } from '../../api/facility';
import Breadcrumb from '../../components/common/BreadCrumb';
import CustomButton from '../../components/common/CustomButton';
import CustomFormik from '../../components/common/CustomFormik';
import Loader from '../../components/common/Loader';
import SelectList from '../../components/common/SelectList';
import TextInput from '../../components/common/TextInput';
import Container from '../../components/Container';

const FacilityForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isEditMode = !!id;
  const [initialValues, setInitialValues] = useState({
    name: '',
    type: '',
    quantity: '',
  });

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    type: yup.string().required('Type is required'),
    quantity: yup.number().required('Quantity is required'),
  });

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchFacility = async () => {
        const res = await getFacility(id);
        if (!res.success) {
          toast.error(res.error);
          navigate('/logistics/facilities');
          return;
        }
        setInitialValues(res.facility);
        setLoading(false);
      };
      fetchFacility();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (values, formikActions) => {
    const res = isEditMode
      ? await updateFacility(id, values)
      : await addFacility(values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      return toast.error(res.error || 'Failed to save facility');
    }

    toast.success(`Facility ${isEditMode ? 'updated' : 'added'} successfully`);
    navigate('/logistics/facilities');
    formikActions.resetForm();
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <Breadcrumb
        pageName={isEditMode ? 'Edit Facility' : 'Add Facility'}
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
              placeholder={'Name'}
              type={'text'}
              required
            />
            <SelectList
              label='Type'
              name='type'
              items={['A/V', 'T/I', 'Electric Appliances', 'Other']}
            />
            <TextInput
              id={'quantity'}
              name={'quantity'}
              placeholder={'quantity'}
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

export default FacilityForm;
