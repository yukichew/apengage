import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import IconButton from '../../components/common/IconButton';
import AppContainer from '../../components/containers/AppContainer';
import { EventItem } from '../../constants/types';
import { Navigation } from '../../navigation/types';

type Props = {
  route: { params: { event: EventItem } };
  navigation: Navigation;
};

const EventDetails = ({ route, navigation }: Props) => {
  const { event } = route.params;

  return (
    <AppContainer navigation={navigation} showBackButton>
      <ScrollView>
        {event.thumbnail && (
          <Image source={{ uri: event.thumbnail }} style={styles.image} />
        )}

        <View style={{ padding: 15 }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{event.name}</Text>
            <IconButton
              icon='share-square-o'
              iconLibrary='FontAwesome'
              style={{ padding: 6 }}
              onPress={() => console.log('notification')}
            />
          </View>

          <View style={styles.detailsContainer}>
            <View style={{ flex: 3 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.iconContainer}>
                  <IconButton
                    icon='calendar-month'
                    iconLibrary='MaterialCommunityIcons'
                    onPress={() => console.log('notification')}
                  />
                </View>
                <View style={{ left: 10 }}>
                  <Text style={styles.text}>
                    {new Date(event.startTime).toLocaleDateString()}
                  </Text>
                  <Text style={styles.desc}>
                    {new Date(event.startTime).toLocaleTimeString()}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <View style={styles.iconContainer}>
                  <IconButton
                    icon='location-pin'
                    iconLibrary='MaterialIcons'
                    onPress={() => console.log('notification')}
                  />
                </View>
                <View style={{ left: 10 }}>
                  <Text style={styles.text}>{event.venue}</Text>
                  {event.mode === 'oncampus' ? (
                    <Text style={styles.desc}>Asia Pacific University</Text>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <IconButton
                icon='ticket-percent-outline'
                iconLibrary='MaterialCommunityIcons'
                onPress={() => console.log('notification')}
                style={{ fontSize: 32, color: '#2A29FF' }}
              />
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 18,
                    color: 'black',
                  },
                ]}
              >
                {event.price ? `RM ${event.price}` : 'Free'}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 18,
                },
              ]}
            >
              About Event
            </Text>
            <Text
              style={[
                styles.desc,
                {
                  textAlign: 'justify',
                  marginTop: 5,
                },
              ]}
            >
              {event.desc}
            </Text>
          </View>
        </View>
      </ScrollView>
    </AppContainer>
  );
};

export default EventDetails;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  image: {
    width,
    height: 240,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    flex: 1,
  },
  detailsContainer: { flexDirection: 'row', marginTop: 14 },
  iconContainer: {
    borderRadius: 10,
    padding: 8,
    backgroundColor: 'rgba(42, 114, 255, 0.08)',
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(0, 0, 0, 0.8)',
  },
  desc: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  priceContainer: {
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
