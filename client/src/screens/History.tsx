import React from 'react';
import { Text } from 'react-native';
import AppContainer from '../components/containers/AppContainer';
import { Navigation } from '../navigation/types';

type Props = {
  navigation: Navigation;
};

const History = ({ navigation }: Props) => {
  return (
    <AppContainer navigation={navigation}>
      <Text>History</Text>
    </AppContainer>
  );
};

export default History;
