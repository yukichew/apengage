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

const TransportItem = ({ item }: Props) => {
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
          <View style={styles.dateRow}>
            <Text style={styles.date}>{formatDateTime(item.departDate)}</Text>
            <Text style={styles.dateSeparator}>-</Text>
            <Text style={styles.date}>{formatDateTime(item.returnDate)}</Text>
          </View>
          <Text style={getStatusStyle(item.status)}>{item.status}</Text>
        </View>

        <View style={styles.row}>
          <View>
            {item.transport === 'Bus' ? (
              <IconButton
                icon='bus'
                iconLibrary='FontAwesome6'
                style={{
                  color: 'rgba(0, 0, 0, 0.85)',
                  textAlign: 'center',
                  fontSize: 17,
                }}
              />
            ) : (
              <IconButton
                icon='van-shuttle'
                iconLibrary='FontAwesome6'
                style={{
                  color: 'rgba(0, 0, 0, 0.85)',
                  textAlign: 'center',
                  fontSize: 17,
                }}
              />
            )}
          </View>

          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-SemiBold',
              color: 'rgba(0, 0, 0, 0.85)',
              marginLeft: 5,
            }}
          >
            {item.event}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Depart:</Text>
          <IconButton
            icon='location'
            iconLibrary='Octicons'
            style={styles.icon}
          />
          <Text style={styles.title}>{item.departFrom}</Text>
          <IconButton
            icon='arrow-right'
            iconLibrary='Octicons'
            style={styles.iconArrow}
          />
          <Text style={styles.title}>{item.departTo}</Text>
        </View>

        {item.returnDate && (
          <View style={styles.row}>
            <Text style={styles.label}>Return:</Text>
            <IconButton
              icon='location'
              iconLibrary='Octicons'
              style={styles.icon}
            />
            <Text style={styles.title}>{item.departTo}</Text>
            <IconButton
              icon='arrow-right'
              iconLibrary='Octicons'
              style={styles.iconArrow}
            />
            <Text style={styles.title}>{item.returnTo}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TransportItem;

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
    padding: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  dateSeparator: {
    marginHorizontal: 6,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.7)',
    marginHorizontal: 4,
    fontSize: 15,
  },
  iconArrow: {
    color: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 8,
    fontSize: 15,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.8)',
    marginRight: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(0, 0, 0, 0.85)',
  },
  statusApproved: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'green',
  },
  statusRejected: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'red',
  },
  statusPending: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'blue',
  },
  statusDefault: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.6)',
  },
});
