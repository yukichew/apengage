import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
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

  const handleRegister = () => {
    const eventIdStr = event.id !== undefined ? String(event.id) : '';
    if (!eventIdStr) {
      Toast.show({
        type: 'error',
        text1: 'Invalid event',
        text2: 'Please try again',
        position: 'top',
        topOffset: 60,
      });
      return;
    }
    navigation.navigate('ParticipantForm', { eventId: eventIdStr });
  };

  const handleShare = async () => {
    try {
      const shareOptions = {
        title: `Check out this event: ${event.name}`,
        message: `Hey, check out this event: ${
          event.name
        } happening on ${new Date(event.startTime).toLocaleDateString()} at ${
          event.venue
        }. It's ${event.price ? `RM ${event.price}` : 'FREE'}!`,
        url: event.thumbnail,
      };

      const res = await Share.open(shareOptions);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'User did not share') {
          console.log('User canceled sharing.');
        } else {
          console.error('Share failed:', err);
          Toast.show({
            type: 'error',
            text1: 'Sharing Failed',
            text2: 'Please try again later.',
            position: 'top',
            topOffset: 60,
          });
        }
      } else {
        console.error('An unknown error occurred:', err);
      }
    }
  };

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
              onPress={handleShare}
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
      <TouchableOpacity style={styles.fab} onPress={handleRegister}>
        <Text style={styles.fabText}>Register Now</Text>
        <View style={styles.icon}>
          <AntDesign name='arrowright' size={18} color='white' />
        </View>
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 3,
      height: 5,
    },
    flexDirection: 'row',
  },
  fabText: {
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
    alignSelf: 'center',
  },
  icon: {
    marginLeft: 10,
    borderRadius: 20,
    backgroundColor: 'black',
    padding: 8,
  },
});
