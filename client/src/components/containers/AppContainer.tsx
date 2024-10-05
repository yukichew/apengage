import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Octicons from 'react-native-vector-icons/Octicons';
import { Navigation } from '../../navigation/types';
import BackButton from '../common/BackButton';

type Props = {
  children: React.ReactNode;
  navigation: Navigation;
  showBackButton?: boolean;
  title?: string;
};

const AppContainer = ({
  navigation,
  children,
  showBackButton,
  title,
}: Props) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          {showBackButton ? (
            <BackButton navigation={navigation} />
          ) : (
            <Pressable
              style={styles.left}
              onPress={() => navigation.navigate('Home')}
            >
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
              />
            </Pressable>
          )}

          <View style={styles.middle}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <Pressable style={styles.right}>
            <Octicons
              name='bell-fill'
              size={16}
              style={{ color: 'rgba(37, 37, 37, 0.4)' }}
            />
          </Pressable>
        </View>

        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AppContainer;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  left: {
    flex: 1,
  },
  logo: {
    width: 90,
    height: 22,
  },
  middle: {
    flex: 2,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    // textAlign: 'center',
    // backgroundColor: 'red',
    paddingStart: 12,
  },
  right: {
    alignItems: 'flex-end',
    flex: 1,
    paddingEnd: 5,
    // backgroundColor: 'blue',
  },
});
