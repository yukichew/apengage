import { StackActions, useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { getCurrentUser, logout } from '../../api/auth';
import IconButton from '../../components/common/IconButton';
import AppContainer from '../../components/containers/AppContainer';
import ProfileItem from '../../components/custom/ProfileItem';
import { User } from '../../constants/types';
import { Navigation } from '../../navigation/types';

type Props = {
  navigation: Navigation;
};

const Profile = ({ navigation }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useFocusEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  });

  const defaultProfile = require('../../assets/profile.png');
  const handleLogout = async () => {
    const res = await logout();
    Toast.show({
      type: 'success',
      text1: 'Logout Successful',
      text2: 'You have been logged out',
    });
    navigation.dispatch(StackActions.replace('Login'));
  };

  return (
    <AppContainer navigation={navigation}>
      <ScrollView style={{ backgroundColor: 'rgba(246, 246, 246, 0.8)' }}>
        <View style={styles.profileContainer}>
          <Image
            source={user?.profile ? { uri: user.profile } : defaultProfile}
            style={styles.image}
          />
          <View style={styles.contentContainer}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-SemiBold',
                color: 'white',
              }}
            >
              {user?.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Light',
                marginTop: 3,
                color: 'white',
              }}
            >
              {user?.apkey}
            </Text>
          </View>

          <IconButton
            icon='mode-edit'
            iconLibrary='MaterialIcons'
            onPress={() => navigation.navigate('EditProfile')}
            style={{ color: 'white', right: 10 }}
          />
        </View>

        <View style={styles.listContainter}>
          <View style={styles.accountContainer}>
            <ProfileItem
              title='My Account'
              desc='Desc'
              onPress={() => console.log('Item pressed')}
              leftIcon={
                <IconButton
                  icon='mode-edit'
                  iconLibrary='MaterialIcons'
                  onPress={() => console.log('edit profile')}
                  style={{ color: '#2A29FF' }}
                />
              }
            />
            <ProfileItem
              title='Change Password'
              desc='Desc'
              onPress={() => console.log('Item pressed')}
              leftIcon={
                <IconButton
                  icon='form-textbox-password'
                  iconLibrary='MaterialCommunityIcons'
                  onPress={() => console.log('edit profile')}
                  style={{ color: '#2A29FF' }}
                />
              }
            />
            <ProfileItem
              title='Logout'
              desc='Desc'
              onPress={handleLogout}
              leftIcon={
                <IconButton
                  icon='logout'
                  iconLibrary='MaterialIcons'
                  onPress={() => console.log('edit profile')}
                  style={{ color: '#2A29FF' }}
                />
              }
            />
          </View>

          <Text
            style={{ fontSize: 16, fontFamily: 'Poppins-Medium', margin: 12 }}
          >
            Notifications
          </Text>

          <View style={styles.accountContainer}>
            <ProfileItem
              title='Push Notification'
              desc='Desc'
              onPress={() => console.log('Item pressed')}
              leftIcon={
                <IconButton
                  icon='notifications-outline'
                  iconLibrary='Ionicons'
                  onPress={() => console.log('edit profile')}
                  style={{ color: '#2A29FF' }}
                />
              }
              rightIcon={
                <IconButton
                  icon='toggle-on'
                  iconLibrary='Fontisto'
                  style={{ color: '#2A29FF', fontSize: 30 }}
                  onPress={() => console.log('notification')}
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    </AppContainer>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    width: width - 30,
    marginVertical: 10,
    alignSelf: 'center',
    padding: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  contentContainer: {
    padding: 10,
    flex: 1,
    left: 3,
  },
  accountContainer: {
    paddingVertical: 5,
    width: width - 30,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  listContainter: {
    padding: 12,
  },
});

export default Profile;
