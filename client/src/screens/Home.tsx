import React from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';
import StackCarousel from '../components/common/StackCarousel';
import AppContainer from '../components/containers/AppContainer';
import FlatListItem from '../components/custom/EventItem';
import ServiceContainer from '../components/custom/ServiceContainer';
import { EventItem, Props } from '../constants/types';
import { useEvents } from '../helpers/EventHelper';

const Home = ({ navigation }: Props) => {
  const { events, loading, refreshEvents } = useEvents();

  const renderItem = ({ item }: { item: EventItem }) => (
    <FlatListItem
      item={item}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    />
  );

  return (
    <AppContainer navigation={navigation}>
      <StackCarousel data={events} maxVisibleItem={3} />
      <ServiceContainer navigation={navigation} />
      <Text
        style={{
          fontSize: 22,
          fontFamily: 'Poppins-Bold',
          marginLeft: 26,
          marginTop: 10,
        }}
      >
        Latest Events
      </Text>
      <FlatList
        data={events.slice(0, 5)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || item.name}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshEvents} />
        }
      />
    </AppContainer>
  );
};

export default Home;
