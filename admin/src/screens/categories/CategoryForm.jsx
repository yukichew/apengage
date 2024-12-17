import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { addCategory, getCategory, updatecategory } from '../../api/category';
import Breadcrumb from '../../components/common/BreadCrumb';
import CustomButton from '../../components/common/CustomButton';
import CustomFormik from '../../components/common/CustomFormik';
import Loader from '../../components/common/Loader';
import TextInput from '../../components/common/TextInput';
import Container from '../../components/Container';

const CategoryForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isEditMode = !!id;
  const [initialValues, setInitialValues] = useState({
    name: '',
    desc: '',
  });

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    desc: yup.string().required('Description is required'),
  });

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchCategory = async () => {
        const res = await getCategory(id);
        if (!res.success) {
          toast.error(res.error);
          navigate('/event/categories');
          return;
        }
        setInitialValues(res.category);
        setLoading(false);
      };
      fetchCategory();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (values, formikActions) => {
    const res = isEditMode
      ? await updatecategory(id, values)
      : await addCategory(values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      return toast.error(res.error || 'Failed to save category');
    }

    toast.success(`Category ${isEditMode ? 'updated' : 'added'} successfully`);
    navigate('/event/categories');
    formikActions.resetForm();
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <Breadcrumb
        pageName={isEditMode ? 'Edit Category' : 'Add Category'}
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
            <TextInput
              id={'desc'}
              name={'desc'}
              placeholder={'Description'}
              type={'text'}
              multiline
              numberOfLines={4}
              required
            />
            <CustomButton title='save' type='submit' />
          </CustomFormik>
        </div>
      </div>
    </Container>
  );
};

export default CategoryForm;
