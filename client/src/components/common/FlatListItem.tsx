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

type Props = {
  item: any;
  onPress: () => void;
};

const FlatListItem = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: item.poster }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.row}>
          <View style={styles.locationContainer}>
            <Octicons
              name='location'
              size={16}
              style={{ color: 'rgba(37, 37, 37, 0.7)' }}
            />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>RM {item.price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FlatListItem;

const { width, height } = Dimensions.get('window');
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
    color: 'rgba(37, 37, 37, 0.5)',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(37, 37, 37, 0.7)',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  row: {
    flexDirection: 'row',
    marginTop: 15,
  },
  priceContainer: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'rgba(42, 114, 255, 0.15)',
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#2A29FF',
  },
});
