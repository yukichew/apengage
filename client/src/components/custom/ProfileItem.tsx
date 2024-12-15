import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconButton from '../common/IconButton';

type Props = {
  leftIcon?: React.ReactNode;
  title: String;
  desc: String;
  onPress: () => void;
  rightIcon?: React.ReactNode;
};

const ProfileItem = ({ leftIcon, title, desc, onPress, rightIcon }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>{leftIcon}</View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
      {rightIcon ? (
        rightIcon
      ) : (
        <IconButton
          icon='right'
          iconLibrary='AntDesign'
          style={{ fontSize: 18 }}
          onPress={() => console.log('notification')}
        />
      )}
    </TouchableOpacity>
  );
};

export default ProfileItem;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    width: width - 40,
    marginVertical: 10,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  iconContainer: {
    borderRadius: 50,
    padding: 15,
    backgroundColor: 'rgba(42, 114, 255, 0.08)',
  },
  contentContainer: {
    flex: 1,
    left: 12,
  },
  desc: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
});
