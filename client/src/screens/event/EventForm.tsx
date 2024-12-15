import { StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import CustomFormik from '../../components/common/CustomFormik';
import DateInput from '../../components/common/DateInput';
import FilePicker from '../../components/common/FilePicker';
import InputText from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import AppContainer from '../../components/containers/AppContainer';
import { Navigation } from '../../navigation/types';
import { getCategories } from '../../utils/categoryManagement';
import { addEvent } from '../../utils/eventManagement';

type Props = {
  navigation: Navigation;
};

const EventForm = ({ navigation }: Props) => {
  const initialValues = {
    name: '',
    desc: '',
    location: '',
    price: '',
    date: '',
    organizer: '',
  };

  const validationSchema = yup.object({
    name: yup.string().required('Event name is required'),
    desc: yup.string().required('Event description is required'),
    location: yup.string().required('Event location is required'),
    price: yup
      .number()
      .required('Registration fee is required. Enter 0 if free'),
    date: yup.date().required('Event date is required'),
    organizer: yup.string().required('Organizer is required'),
  });

  const [selected, setSelected] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [file, setFile] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const payload = { ...values, categories: selected };
    const res = await addEvent(payload, file);
    formikActions.setSubmitting(false);

    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to create event',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Successfully created event',
    });

    navigation.dispatch(StackActions.replace('CustomForm'));
    formikActions.resetForm();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.categories);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to fetch categories',
          text2: res.error,
          position: 'top',
          topOffset: 60,
        });
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [categories, selected, file]);

  return (
    <AppContainer navigation={navigation}>
      <ScrollView
        ref={scrollViewRef}
        style={{ paddingHorizontal: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <CustomFormik
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
            Create Event
          </Text>
          <InputText
            placeholder='Name'
            name='name'
            leftIcon='title'
            leftIconLibrary='MaterialIcons'
          />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: 7 }}>
              <InputText
                placeholder='Location'
                name='location'
                leftIcon='location-outline'
                leftIconLibrary='Ionicons'
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputText
                placeholder='Organizer'
                name='organizer'
                leftIcon='file-text'
                leftIconLibrary='Feather'
              />
            </View>
          </View>
          <DateInput placeholder='Date' name='date' />
          <InputText
            placeholder='Registration Fee'
            name='price'
            keyboardType='numeric'
            leftIcon='attach-money'
            leftIconLibrary='MaterialIcons'
          />
          <InputText
            placeholder='Description'
            name='desc'
            multiline
            numberOfLines={4}
            leftIcon='file-text'
            leftIconLibrary='Feather'
          />
          <MultipleSelectList
            setSelected={(val: string[]) => setSelected(val)}
            data={categories}
            save='key'
            label='Event Categories'
            fontFamily='Poppins-Regular'
            placeholder='Select categories'
            boxStyles={{ marginTop: 8, minHeight: 50 }}
            searchPlaceholder='Search categories'
            maxHeight={160}
            inputStyles={{
              color: 'rgba(0, 0, 0, 0.3)',
              fontSize: 16,
            }}
          />
          <FilePicker
            file={file}
            setFile={setFile}
            type='images'
            placeholder='Upload poster'
          />
          <SubmitButton title='Next' />
        </CustomFormik>
      </ScrollView>
    </AppContainer>
  );
};

export default EventForm;
