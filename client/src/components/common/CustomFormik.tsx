import { Formik } from 'formik';
import React from 'react';

type Props = {
  children: React.ReactNode;
  initialValues: any;
  validationSchema: any;
  onSubmit: (values: any, formikActions?: any) => void;
};

const CustomFormik = ({
  children,
  initialValues,
  validationSchema,
  onSubmit,
}: Props) => {
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
