import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { getParticipatedEvents } from '../../api/event';
import HistoryItem from '../../components/custom/HistoryItem';
import { Props } from '../../constants/types';

const ParticipatedEvents = ({ navigation }: Props) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshEvents = async () => {
    setLoading(true);

    const response = await getParticipatedEvents();
    setEvents(response.data.events);

    if (!response.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch events',
        text2: response.error,
        position: 'top',
        topOffset: 60,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <HistoryItem
      item={item}
      onPress={() =>
        navigation.navigate('Ticket', { registration: item.registrationId })
      }
      onFeedbackPress={() => console.log('Feedback')}
    />
  );

  return (
    <>
      {events ? (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.registrationId.toString()}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshEvents} />
          }
        />
      ) : (
        <Text>No events found</Text>
      )}
    </>
  );
};

export default ParticipatedEvents;
