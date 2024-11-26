import React from 'react';
import { ScrollView, Text } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import * as yup from 'yup';
import Button from '../../components/common/Button';
import CustomFormik from '../../components/common/CustomFormik';
import InputText from '../../components/common/InputText';
import AppContainer from '../../components/containers/AppContainer';
import { Navigation } from '../../navigation/types';

type Props = {
  navigation: Navigation;
};

const EventForm = ({ navigation }: Props) => {
  const initialValues = {
    name: '',
    desc: '',
    location: '',
    price: '',
  };

  const validationSchema = yup.object({
    name: yup.string().required('Event name is required'),
    desc: yup.string().required('Event description is required'),
    location: yup.string().required('Event location is required'),
    price: yup.number().required('Price is required'),
  });

  const onSubmit = async (values: typeof initialValues) => {
    console.log(values);
  };

  const [selected, setSelected] = React.useState<string[]>([]);

  const data = [
    { key: '1', value: 'Mobiles' },
    { key: '2', value: 'Appliances' },
    { key: '3', value: 'Cameras' },
    { key: '4', value: 'Computers' },
    { key: '5', value: 'Vegetables' },
    { key: '6', value: 'Diary Products' },
    { key: '7', value: 'Drinks' },
  ];

  return (
    <AppContainer navigation={navigation}>
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <CustomFormik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 27,
              textAlign: 'center',
              marginTop: 18,
              marginBottom: 10,
            }}
          >
            Create Event
          </Text>
          <InputText
            placeholder='Event Name'
            name='name'
            leftIcon='mail-outline'
            leftIconLibrary='Ionicons'
          />
          <InputText
            placeholder='Event Description'
            name='desc'
            leftIcon='mail-outline'
            leftIconLibrary='Ionicons'
          />
          <InputText
            placeholder='Event Location'
            name='location'
            leftIcon='mail-outline'
            leftIconLibrary='Ionicons'
          />
          <InputText
            placeholder='Event Price'
            name='location'
            leftIcon='mail-outline'
            leftIconLibrary='Ionicons'
          />
          <MultipleSelectList
            setSelected={(val: string[]) => setSelected(val)}
            data={data}
            save='value'
            onSelect={() => console.log(selected)}
            label='Event Categories'
            fontFamily='Poppins-Regular'
            placeholder='Select categories'
            boxStyles={{ marginTop: 10, minHeight: 50 }}
            searchPlaceholder='Search categories'
            maxHeight={160}
          />
          <Button
            title='Next'
            onPress={() => navigation.navigate('CustomForm')}
          />
        </CustomFormik>
      </ScrollView>
    </AppContainer>
  );
};

export default EventForm;
