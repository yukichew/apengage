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
import { searchOrganizedEvents } from '../../api/event';
import SearchBar from '../../components/common/SearchBar';
import OrganizedItem from '../../components/custom/OrganizedItem';
import ServiceContainer from '../../components/custom/ServiceContainer';
import { Props } from '../../constants/types';

const OrganizedEvents = ({ navigation }: Props) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  const refreshEvents = async () => {
    setLoading(true);
    const response = await searchOrganizedEvents(query);
    if (!response.success) {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch events',
        text2: response.error,
        position: 'top',
        topOffset: 60,
      });
    }

    setEvents(response.data.events);
    setCount(response.data.count);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      refreshEvents();
    }, [query])
  );

  const renderItem = ({ item }: { item: any }) => (
    <OrganizedItem
      item={item}
      onPress={() => {
        navigation.navigate('EventHistory', { event: item });
      }}
      onDashboardPress={() =>
        navigation.navigate('Dashboard', { eventId: item.id.toString() })
      }
      onFormPress={() =>
        navigation.navigate('CustomForm', { eventId: item.id.toString() })
      }
    />
  );

  const handleOnChange = (text: string) => {
    setQuery(text);
  };

  const handleClear = async () => {
    setQuery('');
    await refreshEvents();
  };

  const handleOnSubmit = async () => {
    await refreshEvents();
  };

  return (
    <>
      <ServiceContainer navigation={navigation} />

      <SearchBar
        placeholder='Search Organized Events'
        onChangeText={handleOnChange}
        onSubmitEditing={handleOnSubmit}
        onClear={handleClear}
        value={query}
      />

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
      ) : count !== 0 ? (
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
