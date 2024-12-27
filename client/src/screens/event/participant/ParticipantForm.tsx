import { Field as FormikField } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { getForm, joinEvent } from '../../../api/form';
import Checkbox from '../../../components/common/Checkbox';
import CustomFormik from '../../../components/common/CustomFormik';
import InputText from '../../../components/common/InputText';
import SubmitButton from '../../../components/common/SubmitButton';
import AppContainer from '../../../components/containers/AppContainer';
import { Field } from '../../../constants/types';
import { Navigation } from '../../../navigation/types';

type Props = {
  route: { params: { eventId: string } };
  navigation: Navigation;
};

type InitialValues = {
  [key: string]: any;
};

const ParticipantForm = ({ route, navigation }: Props) => {
  const { eventId } = route.params;
  const [formFields, setFormFields] = useState<Field[]>([]);
  const [formId, setFormId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [initialValues, setInitialValues] = useState<InitialValues>({});

  const fetchFields = async () => {
    const res = await getForm({ eventId });
    if (!res.success) {
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch venues',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
    }
    setFormFields(res.data.form.fields);
    setFormId(res.data.form.id);
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const validationSchema = yup.object();

  useEffect(() => {
    const initialValues = formFields.reduce((values, field) => {
      if (field.type === 'checkbox') {
        values[field.id] = field.value || [];
      } else {
        values[field.id] = field.value || '';
      }
      return values;
    }, {} as InitialValues);

    setInitialValues(initialValues);
  }, [formFields]);

  const renderItem = ({ field }: { field: Field }) => {
    return (
      <>
        <Text style={{ fontFamily: 'Poppins-Regular', paddingLeft: 2 }}>
          {field.label}
        </Text>
        {(() => {
          switch (field.type) {
            case 'short_ans':
            case 'long_ans':
              return (
                <InputText
                  key={field.id}
                  placeholder={field.label || ''}
                  name={field.id}
                  multiline={field.type === 'long_ans'}
                  numberOfLines={field.type === 'long_ans' ? 4 : undefined}
                />
              );

            case 'dropdown':
              return (
                <FormikField name={field.id} key={field.id}>
                  {({ field: formikField, form }: any) => (
                    <SelectList
                      key={field.id}
                      setSelected={(val: string) => {
                        form.setFieldValue(field.id, val);
                      }}
                      data={field.options.map((option) => ({
                        key: option,
                        value: option,
                      }))}
                      save='value'
                      placeholder={field.label}
                      search={false}
                      boxStyles={{
                        marginVertical: 7,
                        minHeight: 50,
                        width: '100%',
                      }}
                      inputStyles={{
                        color: formikField.value
                          ? 'rgba(0, 0, 0, 1)'
                          : 'rgba(0, 0, 0, 0.3)',
                        fontSize: 16,
                      }}
                      defaultOption={{
                        key: field.value,
                        value: field.value,
                      }}
                    />
                  )}
                </FormikField>
              );

            case 'mcq':
              return (
                <FormikField name={field.id} key={field.id}>
                  {({ field: formikField, form }: any) => (
                    <Checkbox
                      key={field.id}
                      options={field.options}
                      selectedOptions={formikField.value}
                      onChange={(selected) => {
                        form.setFieldValue(field.id, selected[0]);
                      }}
                      multiple={false}
                    />
                  )}
                </FormikField>
              );

            case 'checkbox':
              return (
                <FormikField name={field.id} key={field.id}>
                  {({ field: formikField, form }: any) => (
                    <Checkbox
                      options={field.options}
                      selectedOptions={formikField.value || []}
                      onChange={(selected: string[]) => {
                        form.setFieldValue(field.id, selected);
                      }}
                      multiple={true}
                    />
                  )}
                </FormikField>
              );

            case 'file':
              return (
                <FormikField name={field.id} key={field.id}>
                  {({ form }: any) => (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={async () => {
                        try {
                          const result = await DocumentPicker.pick({
                            type: [types.allFiles],
                          });
                          form.setFieldValue(field.id, result);
                          console.log('Selected File:', result);
                        } catch (err) {
                          if (DocumentPicker.isCancel(err)) {
                            console.log('File selection canceled');
                          } else {
                            console.error('Unknown Error: ', err);
                          }
                        }
                      }}
                    >
                      <Text style={styles.uploadText}>Upload File</Text>
                    </TouchableOpacity>
                  )}
                </FormikField>
              );

            default:
              return null;
          }
        })()}
      </>
    );
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [formFields]);

  console.log('Form Fields:', initialValues);

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    // const formData = new FormData();
    // for (const key in values) {
    //   formData.append(key, values[key]);
    // }
    // if (selectedFile) {
    //   formData.append('file', selectedFile[0]);
    // }
    const res = await joinEvent({
      formId,
      response: values,
    });

    formikActions.setSubmitting(false);
    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to submit form',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Form submitted successfully!',
    });

    navigation.navigate('History');

    formikActions.resetForm();
  };

  return (
    <AppContainer navigation={navigation} showBackButton>
      <CustomFormik
        key={JSON.stringify(initialValues)}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ paddingHorizontal: 20 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 18,
              marginTop: 6,
              marginBottom: 4,
            }}
          >
            Join Event
          </Text>

          {formFields.map((field) => renderItem({ field }))}

          <SubmitButton title='Save' />
        </ScrollView>
      </CustomFormik>
    </AppContainer>
  );
};

export default ParticipantForm;

const styles = StyleSheet.create({
  container: {
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 8,
    alignSelf: 'center',
    padding: 10,
    borderLeftColor: '#2A29FF',
    borderLeftWidth: 5,
  },
  uploadButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Semibold',
  },
  addFieldContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  input: {
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    width: '100%',
    marginVertical: 6,
    height: 50,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  dropdown: {
    elevation: 5,
    borderRadius: 5,
    width: 180,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 12,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownText: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
});
