import React from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from '../../navigation/types';
import IconButton from '../common/IconButton';

type Props = {
  children: React.ReactNode;
  footer?: React.ReactNode;
  navigation: Navigation;
  showBackButton?: boolean;
};

const AuthContainer = ({
  children,
  footer,
  navigation,
  showBackButton,
}: Props) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.contentContainer}>
        {showBackButton ? (
          <IconButton
            icon='arrow-back'
            iconLibrary='MaterialIcons'
            onPress={() => navigation.goBack()}
          />
        ) : (
          <View style={{ padding: 15 }}></View>
        )}
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <View style={styles.content}>{children}</View>
        <View style={styles.footer}>{footer}</View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthContainer;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    marginTop: height * 0.1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    flex: 1,
  },
  logo: {
    width: width - 70,
    height: 100,
    alignSelf: 'center',
    marginTop: 15,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingBottom: 40,
  },
});
