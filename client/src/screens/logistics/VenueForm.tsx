import { StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { bookVenue, getVenues } from '../../api/venue';
import CustomFormik from '../../components/common/CustomFormik';
import DateInput from '../../components/common/DateInput';
import InputText from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import AppContainer from '../../components/containers/AppContainer';
import { Props } from '../../constants/types';

const VenueForm = ({ navigation }: Props) => {
  const initialValues = {
    startTime: '',
    endTime: '',
    purpose: '',
  };

  const validationSchema = yup.object({
    startTime: yup
      .string()
      .trim()
      .required('Start time is missing')
      .test(
        'is-greater',
        'Start time must be later than current time',
        function (value) {
          const startTime = new Date(value);
          return startTime > new Date();
        }
      ),
    endTime: yup
      .string()
      .required('End time is missing')
      .test(
        'is-after-start',
        'End time must be later than start time',
        function (value) {
          const startTime = new Date(this.parent.startTime);
          const endTime = new Date(value);
          return endTime > startTime;
        }
      ),
    purpose: yup.string().required('Purpose is required'),
  });

  const [selected, setSelected] = useState<string>();
  const [venues, setVenues] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const venueId = selected;

    if (!venueId) {
      Toast.show({
        type: 'error',
        text1: 'Venue is required',
        position: 'top',
        topOffset: 60,
      });
      formikActions.setSubmitting(false);
      return;
    }

    const res = await bookVenue({
      venueId,
      startTime: values.startTime,
      endTime: values.endTime,
      purpose: values.purpose,
    });

    formikActions.setSubmitting(false);

    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to book venue',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Successfully booked venue',
    });

    navigation.dispatch(StackActions.replace('Tabs'));
    formikActions.resetForm();
  };

  useEffect(() => {
    const fetchVenues = async () => {
      const res = await getVenues();
      if (!res.success) {
        return Toast.show({
          type: 'error',
          text1: 'Failed to fetch categories',
          text2: res.error,
          position: 'top',
          topOffset: 60,
        });
      }
      setVenues(res.data);
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [venues, selected]);

  return (
    <AppContainer navigation={navigation} showBackButton>
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
            Book Venue
          </Text>
          <InputText
            placeholder='Purpose'
            name='purpose'
            leftIcon='title'
            leftIconLibrary='MaterialIcons'
          />
          <DateInput
            placeholder='Start Time'
            name='startTime'
            minimumDate={new Date()}
          />
          <DateInput
            placeholder='End Time'
            name='endTime'
            minimumDate={new Date()}
          />
          <SelectList
            setSelected={(val: string) => {
              setSelected(val);
            }}
            data={venues}
            save='key'
            placeholder='Select venue'
            maxHeight={160}
            boxStyles={{ marginVertical: 7, minHeight: 50 }}
            fontFamily='Poppins-Regular'
            inputStyles={{
              color: selected ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
              fontSize: 16,
            }}
            defaultOption={{
              key: selected,
              value:
                venues.find((venue) => venue.key === selected)?.value ||
                'Select Venue',
            }}
          />
          <SubmitButton title='save' />
        </CustomFormik>
      </ScrollView>
    </AppContainer>
  );
};

export default VenueForm;
