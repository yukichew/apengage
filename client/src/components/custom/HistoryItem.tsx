import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { formatDateTime } from '../../utils/formatDate';
import IconButton from '../common/IconButton';

type Props = {
  item: any;
  onPress: () => void;
  onFeedbackPress: () => void;
};

const HistoryItem = ({ item, onPress, onFeedbackPress }: Props) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return styles.statusUpcoming;
      case 'Absent':
        return styles.statusAbsent;
      case 'Attended':
        return styles.statusAttended;
      default:
        return styles.statusDefault;
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{
          uri: item.event.thumbnail.url,
        }}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.date}>{formatDateTime(item.event.startTime)}</Text>
        <Text style={styles.title}>{item.event.name}</Text>

        <View style={styles.row}>
          <View style={styles.locationContainer}>
            <Octicons
              name='location'
              size={16}
              style={{ color: 'rgba(37, 37, 37, 0.7)' }}
            />
            <Text style={styles.locationText}>
              {item.event.mode === 'oncampus'
                ? item.event.venue
                : item.event.location}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={getStatusStyle(item.status)}>{item.status}</Text>
        {item.status === 'Attended' ? (
          <>
            <IconButton
              icon='feedback'
              iconLibrary='MaterialIcons'
              style={{
                color: 'rgba(0, 0, 0, 0.6)',
                fontSize: 35,
                marginVertical: 6,
              }}
              onPress={onFeedbackPress}
            />
            <Text style={styles.statusDefault}>Feedback</Text>
          </>
        ) : (
          <>
            <Image
              source={{
                uri: item.qrCode,
              }}
              style={styles.qrCode}
            />
            <Text style={styles.statusDefault}>Ticket</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HistoryItem;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: width - 40,
    marginVertical: 10,
    alignSelf: 'center',
  },
  contentContainer: {
    padding: 10,
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  date: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statusContainer: {
    alignItems: 'center',
    padding: 10,
  },
  qrCode: {
    width: 50,
    height: 50,
  },
  statusUpcoming: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'green',
  },
  statusAbsent: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'red',
  },
  statusAttended: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'blue',
  },
  statusDefault: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.5)',
  },
});
