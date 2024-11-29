import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import SearchBar from '../../components/common/SearchBar';
import AppContainer from '../../components/containers/AppContainer';
import FlatListItem from '../../components/custom/EventItem';
import { EventItem } from '../../constants/types';
import { useEvents } from '../../helpers/EventHelper';
import { Navigation } from '../../navigation/types';

type Props = {
  navigation: Navigation;
};

const renderItem = ({ item }: { item: EventItem }) => (
  <FlatListItem item={item} onPress={() => console.log('Item pressed')} />
);

const Event = ({ navigation }: Props) => {
  const { events, loading, refreshEvents } = useEvents();

  return (
    <AppContainer navigation={navigation}>
      <SearchBar />
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
