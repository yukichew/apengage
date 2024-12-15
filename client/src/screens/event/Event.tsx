import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import SearchBar from '../../components/common/SearchBar';
import AppContainer from '../../components/containers/AppContainer';
import FlatListItem from '../../components/custom/EventItem';
import { EventItem } from '../../constants/types';
import { useEvents } from '../../helpers/EventHelper';
import { Navigation } from '../../navigation/types';
import { searchEvents } from '../../utils/eventManagement';

type Props = {
  navigation: Navigation;
};

const renderItem = ({ item }: { item: EventItem }) => (
  <FlatListItem item={item} onPress={() => console.log('Item pressed')} />
);

const Event = ({ navigation }: Props) => {
  const { events, loading, refreshEvents } = useEvents();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<EventItem[]>([]);

  const handleOnChange = (text: string) => {
    setQuery(text);
  };
  const handleOnSubmit = async () => {
    const { events, error } = await searchEvents(query);
    if (error) return console.log(error);

    setResults(events);
  };

  return (
    <AppContainer navigation={navigation}>
      <SearchBar
        placeholder='Search Events'
        onChangeText={handleOnChange}
        onSubmitEditing={handleOnSubmit}
      />
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshEvents} />
        }
      />
    </AppContainer>
  );
};

export default Event;
