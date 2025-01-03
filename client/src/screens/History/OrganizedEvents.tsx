import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { getOrganizedEvents } from '../../api/event';
import OrganizedItem from '../../components/custom/OrganizedItem';
import ServiceContainer from '../../components/custom/ServiceContainer';
import { Props } from '../../constants/types';

const OrganizedEvents = ({ navigation }: Props) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshEvents = async () => {
    setLoading(true);
    const response = await getOrganizedEvents();
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

  useFocusEffect(
    useCallback(() => {
      refreshEvents();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <OrganizedItem
      item={item}
      onPress={() =>
        navigation.navigate('Dashboard', { eventId: item.id.toString() })
      }
      onActionPress={() => {
        navigation.navigate('CustomForm', { eventId: item.id.toString() });
      }}
    />
  );

  return (
    <>
      <ServiceContainer navigation={navigation} />
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size='large' color='rgba(0, 0, 0, 0.5)' />
        </View>
      ) : events.length !== 0 ? (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshEvents} />
          }
        />
      ) : (
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
            No events found
          </Text>
        </View>
      )}
    </>
  );
};

export default OrganizedEvents;
