import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { getEventHistory } from '../../api/event';
import { bookTransport } from '../../api/transport';
import CustomFormik from '../../components/common/CustomFormik';
import DateInput from '../../components/common/DateInput';
import InputText from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import AppContainer from '../../components/containers/AppContainer';
import { location, transportType } from '../../constants/items';
import { Props } from '../../constants/types';

const TransportForm = ({ navigation }: Props) => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedReturnToLocation, setSelectedReturnToLocation] =
    useState<string>();
  const [selected, setSelected] = useState<string>();
  const [selectedEvent, setSelectedEvent] = useState<string>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<string>();
  const [needReturnTrip, setNeedReturnTrip] = useState<boolean>(false);

  const initialValues = {
    departTo: '',
    departDate: '',
    returnDate: '',
  };

  const validationSchema = yup.object({
    departDate: yup
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
    departTo: yup.string().trim().required('Arrival location is required'),
  });

  const extractVehicleType = (value: string) => {
    const match = value.match(/^(Bus|Van)/);
    return match ? match[0] : value;
  };

  const onSubmit = async (values: typeof initialValues, formikActions: any) => {
    const transportType = selected ? extractVehicleType(selected) : null;
    if (!transportType) {
      Toast.show({
        type: 'error',
        text1: 'Transport type is required',
        position: 'top',
        topOffset: 60,
      });
      formikActions.setSubmitting(false);
      return;
    }

    const transportId = selectedDeparture;
    if (!transportId) {
      Toast.show({
        type: 'error',
        text1: 'Departure location is required',
        position: 'top',
        topOffset: 60,
      });
      formikActions.setSubmitting(false);
      return;
    }

    const eventId = selectedEvent;
    if (!eventId) {
      Toast.show({
        type: 'error',
        text1: 'Event is required',
        position: 'top',
        topOffset: 60,
      });
      formikActions.setSubmitting(false);
      return;
    }

    const res = await bookTransport({
      transportType: transportType as string,
      departFrom: selectedDeparture,
      departTo: values.departTo,
      returnTo: needReturnTrip ? selectedReturnToLocation : undefined,
      departDate: values.departDate,
      returnDate: needReturnTrip ? values.returnDate : undefined,
      eventId,
    });
    formikActions.setSubmitting(false);

    if (!res.success) {
      console.error(res.error);
      Toast.show({
        type: 'error',
        text1: 'Failed to book transport',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Successfully booked transport',
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

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await getEventHistory();
      if (!res.success) {
        return Toast.show({
          type: 'error',
          text1: 'Failed to fetch events',
          text2: res.error,
          position: 'top',
          topOffset: 60,
        });
      }
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

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
            Book Transport
          </Text>
          <SelectList
            setSelected={(val: string) => setSelected(val)}
            data={transportType}
            save='value'
            placeholder='Select transport type'
            maxHeight={160}
            boxStyles={{ marginVertical: 7, minHeight: 50 }}
            fontFamily='Poppins-Regular'
            inputStyles={{
              color: selected ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)',
              fontSize: 16,
            }}
            defaultOption={{ key: selected, value: selected }}
            search={false}
          />
          <SelectList
            setSelected={(val: string) => setSelectedDeparture(val)}
            data={location}
            save='value'
            placeholder='Select departure location'
            maxHeight={160}
            boxStyles={{ marginVertical: 7, minHeight: 50 }}
            fontFamily='Poppins-Regular'
            inputStyles={{
              color: selectedDeparture
                ? 'rgba(0, 0, 0, 1)'
                : 'rgba(0, 0, 0, 0.3)',
              fontSize: 16,
            }}
            defaultOption={{ key: selectedDeparture, value: selectedDeparture }}
            search={false}
          />
          <InputText placeholder='Arrival Location' name='departTo' />
          <DateInput
            placeholder='Depart Date'
            name='departDate'
            minimumDate={new Date()}
          />
          <SelectList
            setSelected={(val: string) => {
              setSelectedEvent(val);
            }}
            data={events}
            save='key'
            placeholder='Select event'
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
                events.find((event) => event.key === selectedEvent)?.value ||
                'Select Event',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 16,
                marginRight: 10,
              }}
            >
              Do you need a return trip?
            </Text>
            <Switch
              value={needReturnTrip}
              onValueChange={(value) => setNeedReturnTrip(value)}
            />
          </View>
          {needReturnTrip && (
            <>
              <DateInput
                placeholder='Return Date'
                name='returnDate'
                minimumDate={new Date()}
              />
              <SelectList
                setSelected={(val: string) => setSelectedReturnToLocation(val)}
                data={location}
                save='value'
                placeholder='Select return to location'
                maxHeight={160}
                boxStyles={{ marginVertical: 7, minHeight: 50 }}
                fontFamily='Poppins-Regular'
                inputStyles={{
                  color: selectedReturnToLocation
                    ? 'rgba(0, 0, 0, 1)'
                    : 'rgba(0, 0, 0, 0.3)',
                  fontSize: 16,
                }}
                defaultOption={{
                  key: selectedReturnToLocation,
                  value: selectedReturnToLocation,
                }}
                search={false}
              />
            </>
          )}
          <SubmitButton title='save' />
        </CustomFormik>
      </ScrollView>
    </AppContainer>
  );
};

export default TransportForm;
