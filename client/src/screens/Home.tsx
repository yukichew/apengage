import React from 'react';
import StackCarousel from '../components/common/StackCarousel';
import AppContainer from '../components/containers/AppContainer';
import { useEvents } from '../helpers/EventHelper';
import { Navigation } from '../navigation/types';

type Props = {
  navigation: Navigation;
};

const Home = ({ navigation }: Props) => {
  const { events } = useEvents();

  return (
    <AppContainer navigation={navigation}>
      <StackCarousel data={events} maxVisibleItem={3} />
    </AppContainer>
  );
};

export default Home;
