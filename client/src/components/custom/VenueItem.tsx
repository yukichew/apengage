import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatDateTime } from '../../utils/formatDate';
import IconButton from '../common/IconButton';

type Props = {
  item: any;
};

const VenueItem = ({ item }: Props) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return styles.statusApproved;
      case 'Rejected':
        return styles.statusRejected;
      case 'Pending':
        return styles.statusPending;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.rowSpaceBetween}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.date}>{formatDateTime(item.startTime)}</Text>
            <Text style={[styles.date, styles.dateMargin]}>-</Text>
            <Text style={styles.date}>{formatDateTime(item.endTime)}</Text>
          </View>
          <Text style={getStatusStyle(item.status)}>{item.status}</Text>
        </View>

        <View style={styles.row}>
          <IconButton
            icon='location'
            iconLibrary='Octicons'
            style={styles.icon}
          />
          <Text style={styles.title}>{item.venue}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.statusDefault}>{item.purpose}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VenueItem;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    width: width - 30,
    marginVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  date: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  dateMargin: {
    marginHorizontal: 5,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 16,
  },
  statusApproved: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'green',
  },
  statusRejected: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'red',
  },
  statusPending: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'blue',
  },
  statusDefault: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.7)',
  },
});
