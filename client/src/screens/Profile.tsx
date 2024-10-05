import React from 'react';
import { Text } from 'react-native';
import AppContainer from '../components/containers/AppContainer';
import { Navigation } from '../navigation/types';

type Props = {
  navigation: Navigation;
};

const Profile = ({ navigation }: Props) => {
  return (
    <AppContainer navigation={navigation}>
      <Text>Profile</Text>
    </AppContainer>
  );
};

export default Profile;
