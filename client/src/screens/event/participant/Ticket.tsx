import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { getEvent, getRegistration } from '../../../api/event';
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
  const [event, setEvent] = useState<EventItem>();

  const fetchEvent = async () => {
    const res = await getRegistration({ id: registration.id });
    if (!res.success) {
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch event',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
    }

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
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  return (
    <AppContainer navigation={navigation} showBackButton>
      <View style={styles.container}>
        <View style={{ width: '90%', alignSelf: 'center', marginBottom: 14 }}>
          <Text style={styles.text}>Booking ID</Text>
          <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20 }}>
            Title
          </Text>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.text}>Location</Text>
            <Text style={styles.content}></Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.text}>Price</Text>
            <Text style={styles.content}>
              {event?.price ? `RM${event.price}` : 'Free'}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.text}>Ticket Holder</Text>
            <Text style={styles.content}>{registration.participant}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.text}>APKey</Text>
            <Text style={styles.content}>
              {event?.type === 'oncampus' ? event.venue : event?.location}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.text}>Start Time</Text>
            <Text style={styles.content}>
              {event?.startTime ? formatDateTime(event.startTime) : ''}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.text}>End Time</Text>
            <Text style={styles.content}>
              {event?.endTime ? formatDateTime(event.endTime) : ''}
            </Text>
          </View>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: registration.qrCode }} style={styles.qrCode} />
          <Text style={[styles.text, { width: '90%', textAlign: 'justify' }]}>
            The QR code is unique and only allows one entry per scan.
            Unauthorized duplication of this ticket may prevent you admittance
            to the event.
          </Text>
        </View>
      </View>
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
    marginBottom: 10,
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
