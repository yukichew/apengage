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
        return React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...formikProps,
            });
          }
          return child;
        });
      }}
    </Formik>
  );
};

export default CustomFormik;
