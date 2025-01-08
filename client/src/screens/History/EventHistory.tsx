import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import IconButton from '../../components/common/IconButton';
import AppContainer from '../../components/containers/AppContainer';
import { EventItem } from '../../constants/types';
import { Navigation } from '../../navigation/types';
import { formatDateTime } from '../../utils/formatDate';

type Props = {
  route: { params: { event: EventItem } };
  navigation: Navigation;
};

const EventHistory = ({ route, navigation }: Props) => {
  const { event } = route.params;
  if (!event) {
    return Toast.show({
      type: 'error',
      text1: 'Failed to fetch event',
      text2: 'Event not found',
      position: 'top',
      topOffset: 60,
    });
  }

  const capitalizeEachWord = (string: string) => {
    return string.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const eventDetails = [
    { label: 'Name', value: event.name },
    { label: 'Type', value: capitalizeEachWord(event.type) },
    { label: 'Mode', value: capitalizeEachWord(event.mode) },
    { label: 'Description', value: event.desc },
    { label: 'Start Time', value: formatDateTime(event.startTime) },
    { label: 'End Time', value: formatDateTime(event.endTime) },
    {
      label: 'Location',
      value: event.mode === 'oncampus' ? event.venue : event.location,
    },
    { label: 'Organizer', value: event.organizer },
    { label: 'Price', value: event.price ? `RM ${event.price}` : 'Free' },
    { label: 'Status', value: event.status },
    {
      label: 'Created At',
      value: event.createdAt ? formatDateTime(event.createdAt) : 'N/A',
    },
  ];

  return (
    <AppContainer navigation={navigation} showBackButton>
      <ScrollView>
        <View style={styles.container}>
          <IconButton
            icon='edit-3'
            iconLibrary='Feather'
            style={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: 22,
              marginLeft: 'auto',
              marginBottom: 12,
            }}
            onPress={() =>
              navigation.navigate('EventHistoryForm', { eventId: event.id })
            }
          />
          {eventDetails.map((detail, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>{detail.label}</Text>
              <Text style={styles.value}>{detail.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppContainer>
  );
};

export default EventHistory;

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(0, 0, 0, 0.8)',
    flex: 0.4,
  },
  value: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.6)',
    flex: 0.6,
  },
});
