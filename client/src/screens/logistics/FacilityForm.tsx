import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { bookFacility, getFacilities } from '../../api/facility';
import { getVenueBookings } from '../../api/venue';
import CustomFormik from '../../components/common/CustomFormik';
import InputText from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import AppContainer from '../../components/containers/AppContainer';
import { Props } from '../../constants/types';

const FacilityForm = ({ navigation }: Props) => {
  const initialValues = {
    quantity: '',
  };

  const validationSchema = yup.object({
    quantity: yup
      .string()
      .trim()
      .required('Required quantity is missing')
      .matches(/^[0-9]+$/, 'Quantity must be a number'),
  });

  const [selected, setSelected] = useState<string>();
  const [selectedVenue, setSelectedVenue] = useState<string>();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [venueBookings, setVenueBookings] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const facilityId = selected;
    const venueBookingId = selectedVenue;

    if (!facilityId) {
      Toast.show({
        type: 'error',
        text1: 'Facility is required',
        position: 'top',
        topOffset: 60,
      });
      formikActions.setSubmitting(false);
      return;
    }

    if (!venueBookingId) {
      Toast.show({
        type: 'error',
        text1: 'You have to book a venue before booking a facility',
        position: 'top',
        topOffset: 60,
      });
      formikActions.setSubmitting(false);
      return;
    }

    const res = await bookFacility({
      facilityId,
      venueBookingId,
      quantity: Number(values.quantity),
    });

    formikActions.setSubmitting(false);

    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to book facility',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Successfully booked facility',
    });

    navigation.dispatch(
      CommonActions.navigate({
        name: 'Tabs',
        params: {
          screen: 'History',
        },
      })
    );

    formikActions.resetForm();
  };

  const fetchFacilities = async () => {
    const res = await getFacilities();
    if (!res.success) {
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch venues',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
    }
    setFacilities(res.data);
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
    fetchFacilities();
    fetchBookings();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [facilities, selected]);

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
            Book Facility
          </Text>
          <InputText placeholder='Quantity' name='quantity' />
          <SelectList
            setSelected={(val: string) => {
              const selectedFacility = facilities.find(
                (facility) => facility.key === val
              );
              setSelected(val);
            }}
            data={facilities}
            save='key'
            placeholder='Select Facility'
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
                facilities.find((facility) => facility.key === selected)
                  ?.value || 'Select Facility',
            }}
          />
          <SelectList
            setSelected={(val: string) => {
              setSelectedVenue(val);
            }}
            data={venueBookings}
            save='key'
            placeholder='Select Booked Venue'
            maxHeight={160}
            boxStyles={{ marginVertical: 7, minHeight: 50 }}
            fontFamily='Poppins-Regular'
            inputStyles={{
              color: selectedVenue ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
              fontSize: 16,
            }}
            defaultOption={{
              key: selectedVenue,
              value:
                venueBookings.find((booking) => booking.key === selectedVenue)
                  ?.value || 'Select Booked Venue',
            }}
          />
          <SubmitButton title='Submit' />
        </CustomFormik>
      </ScrollView>
    </AppContainer>
  );
};

export default FacilityForm;
