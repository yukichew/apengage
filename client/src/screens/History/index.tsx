import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import AppContainer from '../../components/containers/AppContainer';
import { Navigation } from '../../navigation/types';
import Logistics from './Logistics';
import OrganizedEvents from './OrganizedEvents';
import ParticipatedEvents from './ParticipatedEvents';

type Props = {
  navigation: Navigation;
};

const History = ({ navigation }: Props) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'participated', title: 'Participated' },
    { key: 'organized', title: 'Organized' },
    { key: 'logistics', title: 'Logistics' },
  ]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'participated':
        return <ParticipatedEvents navigation={navigation} />;
      case 'organized':
        return <OrganizedEvents navigation={navigation} />;
      case 'logistics':
        return <Logistics />;
      default:
        return null;
    }
  };

  return (
    <AppContainer navigation={navigation}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={(props) => renderScene(props)}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: 'black' }}
          />
        )}
      />
    </AppContainer>
  );
};

export default History;
