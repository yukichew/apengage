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
import { searchParticipatedEvents } from '../../api/event';
import SearchBar from '../../components/common/SearchBar';
import FeedbackModal from '../../components/custom/FeedbackModal';
import HistoryItem from '../../components/custom/HistoryItem';
import { Props } from '../../constants/types';

const ParticipatedEvents = ({ navigation }: Props) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<
    string | null
  >(null);
  const [query, setQuery] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  const refreshEvents = async () => {
    setLoading(true);
    const response = await searchParticipatedEvents(query);

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
    <HistoryItem
      item={item}
      onPress={() =>
        navigation.navigate('Ticket', { registration: item.registrationId })
      }
      onFeedbackPress={() => {
        setSelectedRegistrationId(item.registrationId);
        setIsModalVisible(true);
      }}
    />
  );

  const handleOnChange = (text: string) => {
    setQuery(text);
  };

  const handleOnSubmit = async () => {
    await refreshEvents();
  };

  const handleClear = async () => {
    setQuery('');
    await refreshEvents();
  };

  return (
    <>
      <SearchBar
        placeholder='Search Participated Events'
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
          keyExtractor={(item) => item.registrationId.toString()}
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

      {/* feedback */}
      <FeedbackModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        registrationId={selectedRegistrationId || ''}
      />
    </>
  );
};

export default ParticipatedEvents;
