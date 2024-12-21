import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import SearchBar from '../../components/common/SearchBar';
import AppContainer from '../../components/containers/AppContainer';
import FlatListItem from '../../components/custom/EventItem';
import { EventItem, Props } from '../../constants/types';
import { useEvents } from '../../helpers/EventHelper';

const Event = ({ navigation }: Props) => {
  const { events, loading, refreshEvents } = useEvents();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<EventItem[]>([]);

  useEffect(() => {
    setResults(events);
  }, [events]);

  const handleOnChange = (text: string) => {
    setQuery(text);
  };

  const handleOnSubmit = async () => {
    // const { data } = await searchEvents(query);
    // setResults(data);
  };

  const renderItem = ({ item }: { item: EventItem }) => (
    <FlatListItem
      item={item}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    />
  );

  return (
    <AppContainer navigation={navigation}>
      <SearchBar
        placeholder='Search Events'
        onChangeText={handleOnChange}
        onSubmitEditing={handleOnSubmit}
      />
      {events && (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || item.name}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshEvents} />
          }
        />
      )}
      {!events && <Text>No events found</Text>}
    </AppContainer>
  );
};

export default Event;
