import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Props } from '../../constants/types';
import IconButton from '../common/IconButton';

const ServiceContainer = ({ navigation }: Props) => (
  <View style={styles.serviceContainer}>
    <View style={styles.iconWrapper}>
      <View style={styles.iconContainer}>
        <IconButton
          icon='add-location-alt'
          iconLibrary='MaterialIcons'
          onPress={() => navigation.navigate('BookVenue')}
          style={styles.iconButton}
        />
      </View>
      <Text style={styles.label}>Venue</Text>
    </View>
    <View style={styles.iconWrapper}>
      <View style={styles.iconContainer}>
        <IconButton
          icon='modern-mic'
          iconLibrary='Entypo'
          onPress={() => navigation.navigate('BookFacility')}
          style={styles.iconButton}
        />
      </View>
      <Text style={styles.label}>Facilities</Text>
    </View>
    <View style={styles.iconWrapper}>
      <View style={styles.iconContainer}>
        <IconButton
          icon='bus'
          iconLibrary='FontAwesome6'
          onPress={() => navigation.navigate('BookTransport')}
          style={styles.iconButton}
        />
      </View>
      <Text style={styles.label}>Transport</Text>
    </View>
    <View style={styles.iconWrapper}>
      <View style={styles.iconContainer}>
        <IconButton
          icon='qrcode-scan'
          iconLibrary='MaterialCommunityIcons'
          onPress={() => navigation.navigate('QRCodeScan')}
          style={styles.iconButton}
        />
      </View>
      <Text style={styles.label}>Attendance</Text>
    </View>
  </View>
);

export default ServiceContainer;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  serviceContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 82,
    marginVertical: 10,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(42, 114, 255, 0.15)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    width: 58,
    height: 58,
  },
  iconButton: {
    color: '#2A29FF',
  },
  label: {
    marginTop: 5,
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(0, 0, 0, 0.6)',
  },
});
