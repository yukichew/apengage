import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';

type Props = {
  children: React.ReactNode;
};

const AuthContainer = ({children}: Props) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthContainer;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: width - 65,
    height: 110,
    marginTop: height * 0.1,
    alignSelf: 'center',
  },
});
