import React from 'react';
import StackCarousel from '../components/common/StackCarousel';
import AppContainer from '../components/containers/AppContainer';
import { Navigation } from '../navigation/types';

type Props = {
  navigation: Navigation;
};

type CarouselItem = {
  title: string;
  date: Date;
  poster: string;
  description: string;
};

export const data: CarouselItem[] = [
  {
    title: 'Item 1',
    date: new Date(),
    poster: 'https://picsum.photos/270/250',
    description: 'Description 1',
  },
  {
    title: 'Item 2',
    date: new Date(),
    poster: 'https://picsum.photos/270/250',
    description: 'Description 2',
  },
  {
    title: 'Item 3',
    date: new Date(),
    poster: 'https://picsum.photos/270/250',
    description: 'Description 3',
  },
];

const Home = ({ navigation }: Props) => {
  return (
    <AppContainer navigation={navigation}>
      <StackCarousel data={data} maxVisibleItem={3} />
    </AppContainer>
  );
};

export default Home;
