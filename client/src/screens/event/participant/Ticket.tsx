import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNCalendarEvents, { Calendar } from 'react-native-calendar-events';
import Toast from 'react-native-toast-message';
import { getEvent, getRegistration } from '../../../api/event';
import Button from '../../../components/common/Button';
import AppContainer from '../../../components/containers/AppContainer';
import { EventItem } from '../../../constants/types';
import { Navigation } from '../../../navigation/types';
import { formatDateTime } from '../../../utils/formatDate';

type Props = {
  route: { params: { registration: any } };
  navigation: Navigation;
};

const Ticket = ({ route, navigation }: Props) => {
  const { registration } = route.params;
  const [event, setEvent] = useState<EventItem | null>(null);
  const [info, setInfo] = useState<any | null>(null);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [pickedCal, setPickedCal] = useState<Calendar | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvent = async () => {
    setLoading(true);
    const res = await getRegistration({ id: registration });
    if (!res.success) {
      setLoading(false);
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch event',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
    }
    setInfo(res.data.registration);

    const res2 = await getEvent({ id: res.data.registration.eventId });
    if (!res2.success) {
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch event',
        text2: res2.error,
        position: 'top',
        topOffset: 60,
      });
    }
    setEvent(res2.data.event);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  useEffect(() => {
    async function loadCalendars() {
      try {
        const perms = await RNCalendarEvents.requestPermissions();
        if (perms === 'authorized') {
          const allCalendars = await RNCalendarEvents.findCalendars();
          const primaryCal = allCalendars.find(
            (cal) => cal.isPrimary && cal.allowsModifications
          );
          setCalendars(allCalendars);
          setPickedCal(primaryCal || null);
        } else {
          console.log('Calendar permission denied.');
        }
      } catch (error) {
        console.log('Error while fetching calendars:', error);
      }
    }

    if (Platform.OS === 'android') {
      loadCalendars();
    }
  }, []);

  const addToCalendar = async () => {
    if (!event) return;

    try {
      const status = await RNCalendarEvents.requestPermissions();
      if (status !== 'authorized') {
        return Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Calendar permission is required to add events',
          position: 'top',
          topOffset: 60,
        });
      }

      const eventDetails = {
        title: event.name,
        startDate: new Date(event.startTime).toISOString(),
        endDate: new Date(event.endTime).toISOString(),
        location: event.mode === 'oncampus' ? event.venue : event.location,
        notes: `${event.desc}`,
        calendar: 'default',
      };

      await RNCalendarEvents.saveEvent(eventDetails.title, {
        ...eventDetails,
        alarms: [{ date: -24 * 60 }], // 1 day before
      });

      Toast.show({
        type: 'success',
        text1: 'Event Added',
        text2: 'The event has been added to your calendar',
        position: 'top',
        topOffset: 60,
      });
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Toast.show({
        type: 'error',
        text1: 'Failed to Add Event',
        text2: errorMessage,
        position: 'top',
        topOffset: 60,
      });
    }
  };

  return (
    <AppContainer navigation={navigation} showBackButton>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size='large' color='#0000ff' />
        </View>
      ) : !event || !info ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
              color: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            No event found
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={{ width: '90%', alignSelf: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20 }}>
              {event.name}
            </Text>
          </View>

          <View style={styles.textContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.text}>Location</Text>
              <Text style={styles.content}>
                {event.mode === 'oncampus' ? event.venue : event.location}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.text}>Price</Text>
              <Text style={styles.content}>
                {event.price ? `RM${event.price}` : 'Free'}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.text}>Ticket Holder</Text>
              <Text style={styles.content}>{info.participant.fullname}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.text}>APKey</Text>
              <Text style={styles.content}>{info.participant.apkey}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.text}>Start Time</Text>
              <Text style={styles.content}>
                {event.startTime ? formatDateTime(event.startTime) : ''}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.text}>End Time</Text>
              <Text style={styles.content}>
                {event.endTime ? formatDateTime(event.endTime) : ''}
              </Text>
            </View>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: info.qrCode }} style={styles.qrCode} />
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 10,
                color: 'rgba(0, 0, 0, 0.5)',
                marginBottom: 10,
              }}
            >
              {registration}
            </Text>
            <Text style={[styles.text, { width: '90%', textAlign: 'justify' }]}>
              The QR code is unique and only allows one entry per scan.
              Unauthorized duplication of this ticket may prevent you admittance
              to the event.
            </Text>
          </View>

          <Button title='Add to Calendar' onPress={addToCalendar} />
        </View>
      )}
    </AppContainer>
  );
};

export default Ticket;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    padding: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: 'white',
    width: width - 60,
    alignSelf: 'center',
    marginVertical: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  qrCode: {
    width: 170,
    height: 170,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  gridItem: {
    width: '45%',
    marginBottom: 13,
  },
  content: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});
