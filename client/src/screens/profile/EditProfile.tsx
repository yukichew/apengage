import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import CustomFormik from '../../components/common/CustomFormik';
import FilePicker from '../../components/common/FilePicker';
import InputText from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import AppContainer from '../../components/containers/AppContainer';
import { gender } from '../../constants/items';
import { Navigation } from '../../navigation/types';
import { getCurrentUser } from '../../utils/auth';
import { editProfile } from '../../utils/profile';

type Props = {
  navigation: Navigation;
};

const EditProfile = ({ navigation }: Props) => {
  const [file, setFile] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [selected, setSelected] = useState<string>();

  const [initialValues, setInitialValues] = useState({
    name: '',
    course: '',
    intake: '',
    contact: '',
  });

  useFocusEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setInitialValues({
          name: user.name,
          course: user.course,
          intake: user.intake,
          contact: user.contact,
        });
        setSelected(user.gender);
      }
    };
    fetchUser();
  });

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    course: yup.string().required('Course is required'),
    intake: yup.string().required('Intake is required'),
    contact: yup
      .string()
      .matches(
        /^\+?[1-9]\d{1,14}$/,
        'Contact must be a valid phone number with country code (e.g., +60123456789)'
      )
      .required('Contact is required'),
  });

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const payload = { ...values, gender: selected || '' };
    const res = await editProfile(payload, file);
    formikActions.setSubmitting(false);

    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to edit profile',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Successfully edited profile',
    });
    navigation.goBack();
    formikActions.resetForm();
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <AppContainer navigation={navigation} showBackButton>
      <ScrollView
        ref={scrollViewRef}
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <CustomFormik
          key={JSON.stringify(initialValues)}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 18,
              marginTop: 6,
              marginBottom: 4,
            }}
          >
            Edit Profile
          </Text>
          <InputText placeholder='Name (as per NRIC)' name='name' />
          <InputText placeholder='Contact' name='contact' />
          <InputText
            placeholder='Course (e.g., Foundation in Computing)'
            name='course'
          />
          <InputText placeholder='Intake (e.g., APU3F2405SE)' name='intake' />
          <SelectList
            setSelected={(val: string) => setSelected(val)}
            data={gender}
            save='value'
            placeholder='Gender'
            maxHeight={160}
            boxStyles={{ marginVertical: 7, minHeight: 50 }}
            fontFamily='Poppins-Regular'
            inputStyles={{
              color: selected ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
              fontSize: 16,
            }}
            defaultOption={{ key: selected, value: selected }}
          />
          <FilePicker
            file={file}
            setFile={setFile}
            type='images'
            placeholder='Upload profile picture'
          />
          <SubmitButton title='SAVE' />
        </CustomFormik>
      </ScrollView>
    </AppContainer>
  );
};

export default EditProfile;
