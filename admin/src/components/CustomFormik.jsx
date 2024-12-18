import { Formik } from 'formik';
import React from 'react';

const CustomFormik = ({
  children,
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => {
        return children;
      }}
    </Formik>
  );
};

export default CustomFormik;
