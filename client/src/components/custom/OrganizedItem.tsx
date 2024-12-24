import React, { useState } from 'react';
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
const placeholder = require('../../assets/placeholder.png');

type Props = {
  item: any;
  onPress: () => void;
  //   onFeedbackPress: () => void;
};

const OrganizedItem = ({ item, onPress }: Props) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return styles.statusUpcoming;
      case 'Rejected':
        return styles.statusAbsent;
      case 'Pending':
        return styles.statusAttended;
      default:
        return styles.statusDefault;
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{
          uri: item.thumbnail ? item.thumbnail : placeholder,
        }}
        style={styles.image}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.type}>{item.type.toUpperCase()} EVENT</Text>
        <Text style={styles.date}>{formatDateTime(item.endTime)}</Text>
        <Text style={styles.title}>{item.name}</Text>

        <View style={styles.row}>
          <View style={styles.locationContainer}>
            <Octicons
              name='location'
              size={16}
              style={{ color: 'rgba(37, 37, 37, 0.7)' }}
            />
            <Text style={styles.locationText}>test</Text>
          </View>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={getStatusStyle(item.status)}>{item.status}</Text>
        <IconButton
          icon='info-with-circle'
          iconLibrary='Entypo'
          style={{
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: 25,
            marginVertical: 8,
          }}
          //   onPress={toggleDropdown}
        />
        <Text style={styles.statusDefault}>More</Text>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => console.log('Mark Attendance')}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownText}>Mark Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Analytics Dashboard')}>
            <Text style={styles.dropdownText}>Analytics Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OrganizedItem;

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
    color: 'rgba(0, 0, 0, 0.6)',
  },
  type: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    fontSize: 14,
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
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  dropdownText: {
    padding: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  dropdownItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },
});
