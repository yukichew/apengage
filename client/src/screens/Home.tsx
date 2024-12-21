import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import IconButton from '../components/common/IconButton';
import StackCarousel from '../components/common/StackCarousel';
import AppContainer from '../components/containers/AppContainer';
import { Props } from '../constants/types';
import { useEvents } from '../helpers/EventHelper';

const Home = ({ navigation }: Props) => {
  const { events } = useEvents();

  return (
    <AppContainer navigation={navigation}>
      <StackCarousel data={events} maxVisibleItem={3} />
      <View style={styles.serviceContainer}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconContainer}>
            <IconButton
              icon='stepforward'
              iconLibrary='AntDesign'
              onPress={() => navigation.navigate('BookVenue')}
              style={styles.iconButton}
            />
          </View>
          <Text style={styles.label}>Venue</Text>
        </View>
        <View style={styles.iconWrapper}>
          <View style={styles.iconContainer}>
            <IconButton
              icon='stepforward'
              iconLibrary='AntDesign'
              onPress={() => navigation.navigate('BookFacility')}
              style={styles.iconButton}
            />
          </View>
          <Text style={styles.label}>Facilities</Text>
        </View>
        <View style={styles.iconWrapper}>
          <View style={styles.iconContainer}>
            <IconButton
              icon='stepforward'
              iconLibrary='AntDesign'
              onPress={() => navigation.navigate('BookTransport')}
              style={styles.iconButton}
            />
          </View>
          <Text style={styles.label}>Transport</Text>
        </View>
        <View style={styles.iconWrapper}>
          <View style={styles.iconContainer}>
            <IconButton
              icon='stepforward'
              iconLibrary='AntDesign'
              onPress={() => navigation.navigate('BookTransport')}
              style={styles.iconButton}
            />
          </View>
          <Text style={styles.label}>Label</Text>
        </View>
      </View>
    </AppContainer>
  );
};

export default Home;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  serviceContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 80,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'black',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 55,
  },
  iconButton: {
    color: 'white',
    // fontSize: 20,
  },
  label: {
    marginTop: 5,
    fontSize: 11,
    color: 'black',
  },
});
