import { StackActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import {
  MultipleSelectList,
  SelectList,
} from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { getCategories } from '../../../api/category';
import { addEvent } from '../../../api/event';
import { getVenueBookings } from '../../../api/venue';
import Button from '../../../components/common/Button';
import CustomFormik from '../../../components/common/CustomFormik';
import DateInput from '../../../components/common/DateInput';
import FilePicker from '../../../components/common/FilePicker';
import InputText from '../../../components/common/InputText';
import SubmitButton from '../../../components/common/SubmitButton';
import AppContainer from '../../../components/containers/AppContainer';
import { eventType, mode } from '../../../constants/items';
import { Props } from '../../../constants/types';

const EventForm = ({ navigation }: Props) => {
  const initialValues = {
    name: '',
    desc: '',
    organizer: '',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    location: '',
    price: 0,
  };

  const validationSchema = yup.object({
    name: yup.string().trim().required('Event name is missing'),
    desc: yup.string().trim().required('Event description is missing'),
    startTime: yup
      .string()
      .trim()
      .required('Event start time is missing')
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
      .required('Event end time is missing')
      .test(
        'is-after-start',
        'End time must be later than start time',
        function (value) {
          const startTime = new Date(this.parent.startTime);
          const endTime = new Date(value);
          return endTime > startTime;
        }
      ),
    organizer: yup.string().trim().required('Event organizer is missing'),
    location: yup.string().when(['selectedMode'], ([mode], schema) => {
      if (mode === 'offcampus' || mode === 'online') {
        return schema.trim().required('Location or platform is required');
      }
      return schema.nullable();
    }),
    price: yup.number().when(['selectedType'], ([eventType], schema) => {
      if (eventType === 'public') {
        return schema
          .required('Registration is required. Enter 0 if free')
          .min(0, 'Price must be a positive number');
      }
      return schema.nullable();
    }),
  });

  const [selectedMode, setSelectedMode] = useState<string>();
  const [selectedType, setSelectedType] = useState<string>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [venueBooking, setVenueBooking] = useState<boolean>(false);
  const [venueBookings, setVenueBookings] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>();
  const [page, setPage] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [file, setFile] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const mode = selectedMode;
    const type = selectedType;

    if (!mode) {
      Toast.show({
        type: 'error',
        text1: 'Mode is required',
        position: 'top',
        topOffset: 60,
      });
      formikActions.setSubmitting(false);
      return;
    }

    if (!type) {
      Toast.show({
        type: 'error',
        text1: 'Type is required',
        position: 'top',
        topOffset: 60,
      });
      formikActions.setSubmitting(false);
      return;
    }

    const data: any = {
      ...values,
      type,
      mode,
    };

    if (mode === 'oncampus') {
      data.venue = selectedVenue;
    }

    if (type === 'public') {
      data.categories = selectedCategories;
    }

    if (type === 'public' && file) {
      data.thumbnail = file;
    }

    const res = await addEvent(data);
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

    // navigation.dispatch(
    //   StackActions.replace('CustomForm', { eventId: res.data.event._id })
    // );
    navigation.dispatch(StackActions.replace('Tabs'));
    formikActions.resetForm();
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    if (res.success) {
      setCategories(res.data);
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

  const fetchBookings = async () => {
    const res = await getVenueBookings();
    if (!res.success) {
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch venues',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
    }
    setVenueBookings(res.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchBookings();
  }, []);

  const sections = [
    {
      title: 'Create Event',
      content: (
        <>
          <SelectList
            setSelected={(type: string) => setSelectedType(type)}
            data={eventType}
            placeholder='Select event type'
            search={false}
            save='value'
            maxHeight={160}
            boxStyles={{ marginVertical: 7, minHeight: 50 }}
            fontFamily='Poppins-Regular'
            inputStyles={{
              color: selectedType ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
              fontSize: 16,
            }}
            defaultOption={{ key: selectedType, value: selectedType }}
          />
          <SelectList
            setSelected={(val: string) => setSelectedMode(val)}
            data={mode}
            search={false}
            save='value'
            placeholder='Select event mode'
            maxHeight={160}
            boxStyles={{ marginVertical: 7, minHeight: 50 }}
            fontFamily='Poppins-Regular'
            inputStyles={{
              color: selectedMode ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
              fontSize: 16,
            }}
            defaultOption={{ key: selectedMode, value: selectedMode }}
          />

          {selectedMode === 'offcampus' ? (
            <InputText
              placeholder='Location'
              name='location'
              leftIcon='location-outline'
              leftIconLibrary='Ionicons'
            />
          ) : selectedMode === 'online' ? (
            <InputText
              placeholder='Platform'
              name='location'
              leftIcon='location-outline'
              leftIconLibrary='Ionicons'
            />
          ) : selectedMode === 'oncampus' ? (
            <>
              <Text
                style={{
                  fontSize: 14,
                  left: 5,
                  fontFamily: 'Poppins-Regular',
                  color: 'rgba(0, 0, 0, 0.8)',
                }}
              >
                Have you booked a venue?
              </Text>
              <Switch value={venueBooking} onValueChange={setVenueBooking} />
              {venueBooking && venueBookings.length > 0 && (
                <SelectList
                  setSelected={(val: string) => {
                    const selectedVenue = venueBookings.find(
                      (booking) => booking.key === val
                    );
                    setSelectedVenue(val);
                  }}
                  data={venueBookings}
                  save='key'
                  placeholder='Select Booked Venue'
                  maxHeight={160}
                  boxStyles={{ marginVertical: 7, minHeight: 50 }}
                  fontFamily='Poppins-Regular'
                  inputStyles={{
                    color: selectedVenue
                      ? 'rgba(0, 0, 0, 1)'
                      : 'rgba(0, 0, 0, 0.3)',
                    fontSize: 16,
                  }}
                  defaultOption={
                    selectedVenue
                      ? {
                          key: selectedVenue,
                          value:
                            venueBookings.find(
                              (booking) => booking.key === selectedVenue
                            )?.value || 'Select Booked Venue',
                        }
                      : undefined
                  }
                  search={false}
                />
              )}
            </>
          ) : null}
        </>
      ),
    },
    {
      title: 'Basic Details',
      content: (
        <>
          <InputText
            placeholder='Event Name'
            name='name'
            leftIcon='title'
            leftIconLibrary='MaterialIcons'
          />
          <InputText
            placeholder='Event Organizer (e.g. club name)'
            name='organizer'
            leftIcon='people'
            leftIconLibrary='Ionicons'
          />
          <InputText
            placeholder='Event Description'
            name='desc'
            multiline
            numberOfLines={4}
            leftIcon='file-text'
            leftIconLibrary='Feather'
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
        </>
      ),
    },
  ];

  if (selectedType === 'public') {
    sections.push({
      title: 'Additional Details',
      content: (
        <>
          <FilePicker
            file={file}
            setFile={setFile}
            type='images'
            placeholder='Upload Poster'
          />
          <InputText
            placeholder='Registration Fee'
            name='price'
            keyboardType='numeric'
            leftIcon='attach-money'
            leftIconLibrary='MaterialIcons'
          />
          <MultipleSelectList
            setSelected={(val: string[]) => setSelectedCategories(val)}
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
        </>
      ),
    });
  }

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
            {sections[page].title}
          </Text>

          {sections[page].content}
          <View>
            {page > 0 && (
              <Button
                title='Back'
                onPress={() => setPage((prev) => prev - 1)}
              />
            )}
            {page < sections.length - 1 ? (
              <Button
                title='Next'
                onPress={() => setPage((prev) => prev + 1)}
              />
            ) : (
              <SubmitButton title='Submit' />
            )}
          </View>
        </CustomFormik>
      </ScrollView>
    </AppContainer>
  );
};

export default EventForm;
