import React from 'react';
import { FlatList } from 'react-native';
import FlatListItem from '../components/common/FlatListItem';
import SearchBar from '../components/common/SearchBar';
import AppContainer from '../components/containers/AppContainer';
import { Navigation } from '../navigation/types';

type Props = {
  navigation: Navigation;
};

type EventItem = {
  id: number;
  title: string;
  date: Date;
  poster: string;
  description: string;
  price: number;
  location: string;
};

const data: EventItem[] = [
  {
    id: 1,
    title: 'Item 1',
    date: new Date(),
    poster: 'https://picsum.photos/270/250',
    description: 'Description 1',
    price: 10,
    location: 'Location 1',
  },
  {
    id: 2,
    title: 'Item 2',
    date: new Date(),
    poster: 'https://picsum.photos/270/250',
    description: 'Description 2',
    price: 20,
    location: 'Location 2',
  },
  {
    id: 3,
    title: 'Item 3',
    date: new Date(),
    poster: 'https://picsum.photos/270/250',
    description: 'Description 3',
    price: 0,
    location: 'Location 3',
  },
];

const renderItem = ({ item }: { item: EventItem }) => (
  <FlatListItem
    item={{
      ...item,
      date: item.date.toLocaleDateString(),
    }}
    onPress={() => console.log('Item pressed')}
  />
);

const Event = ({ navigation }: Props) => {
  return (
    <AppContainer navigation={navigation}>
      <SearchBar />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1 }}
      />
    </AppContainer>
  );
};

export default Event;
