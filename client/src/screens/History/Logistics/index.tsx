import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { getFacilityBookingHistory } from '../../../api/facility';
import { getTransportBookingHistory } from '../../../api/transport';
import { getVenueBookingHistory } from '../../../api/venue';
import Button from '../../../components/common/Button';
import FacilityBooking from './FacilityBooking';
import TransportBooking from './TransportBooking';
import VenueBooking from './VenueBooking';

const Logistics = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('venue');

  const refreshEvents = async (category: string) => {
    setLoading(true);
    let response;
    switch (category) {
      case 'venue':
        response = await getVenueBookingHistory();
        break;
      case 'facility':
        response = await getFacilityBookingHistory();
        break;
      case 'transport':
        response = await getTransportBookingHistory();
        break;
      default:
        break;
    }

    if (!response?.success) {
      return Toast.show({
        type: 'error',
        text1: 'Failed to fetch bookings',
        text2: response?.error,
        position: 'top',
        topOffset: 60,
      });
    }

    setBookings(response?.data.bookings);
    setLoading(false);
  };

  const handleButtonPress = (category: string) => {
    setSelectedCategory(category);
    refreshEvents(category);
  };

  useEffect(() => {
    refreshEvents(selectedCategory);
  }, [selectedCategory]);

  const renderBookingHistory = () => {
    switch (selectedCategory) {
      case 'venue':
        return (
          <VenueBooking
            bookings={bookings}
            loading={loading}
            refreshEvents={refreshEvents}
          />
        );
      case 'facility':
        return (
          <FacilityBooking
            bookings={bookings}
            loading={loading}
            refreshEvents={refreshEvents}
          />
        );
      case 'transport':
        return (
          <TransportBooking
            bookings={bookings}
            loading={loading}
            refreshEvents={refreshEvents}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title='Venue'
          onPress={() => handleButtonPress('venue')}
          containerStyle={[
            styles.buttonStyle,
            selectedCategory === 'venue' && styles.selectedButtonStyle,
          ]}
          textStyle={[
            styles.buttonTextStyle,
            selectedCategory === 'venue' && styles.selectedButtonTextStyle,
          ]}
        />
        <Button
          title='Facility'
          onPress={() => handleButtonPress('facility')}
          containerStyle={[
            styles.buttonStyle,
            selectedCategory === 'facility' && styles.selectedButtonStyle,
          ]}
          textStyle={[
            styles.buttonTextStyle,
            selectedCategory === 'facility' && styles.selectedButtonTextStyle,
          ]}
        />
        <Button
          title='Transport'
          onPress={() => handleButtonPress('transport')}
          containerStyle={[
            styles.buttonStyle,
            selectedCategory === 'transport' && styles.selectedButtonStyle,
          ]}
          textStyle={[
            styles.buttonTextStyle,
            selectedCategory === 'transport' && styles.selectedButtonTextStyle,
          ]}
        />
      </View>
      {renderBookingHistory()}
    </View>
  );
};

export default Logistics;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  buttonStyle: {
    width: '32%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2A29FF',
    height: 40,
  },
  buttonTextStyle: {
    color: '#2A29FF',
    fontSize: 15,
  },
  selectedButtonStyle: {
    backgroundColor: 'rgba(42, 114, 255, 0.15)',
  },
  selectedButtonTextStyle: {
    color: '#2A29FF',
  },
});
