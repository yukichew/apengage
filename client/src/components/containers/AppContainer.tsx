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
import { Navigation } from '../../navigation/types';
import IconButton from '../common/IconButton';

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
            <IconButton
              icon='arrow-back'
              iconLibrary='MaterialIcons'
              onPress={() => navigation.goBack()}
            />
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
            <IconButton
              icon='bell-fill'
              iconLibrary='Octicons'
              style={{ fontSize: 16, color: 'rgba(37, 37, 37, 0.4)' }}
              onPress={() => console.log('notification')}
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
    paddingStart: 12,
  },
  right: {
    alignItems: 'flex-end',
    flex: 1,
    paddingEnd: 5,
  },
});
