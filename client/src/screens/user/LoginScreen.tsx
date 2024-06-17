import {StyleSheet, View} from 'react-native';
import AuthContainer from '../../components/containers/AuthContainer';
import TextInput from '../../components/common/InputText';
import Button from '../../components/common/Button';
import TextLink from '../../components/common/TextLink';

const LoginScreen = () => {
  return (
    <AuthContainer>
      <TextInput
        value=""
        placeholder="Enter Email"
        onChangeText={() => console.log('Email')}
        iconName="user-circle"
        iconLibrary="FontAwesome5Icon"
      />

      <TextInput
        value=""
        placeholder="Enter Password"
        onChangeText={() => console.log('Password')}
        iconName="lock-outline"
        iconLibrary="MaterialIcons"
      />

      <View style={styles.forgetPasswordContainer}>
        <TextLink
          text="Forget password?"
          onPress={() => console.log('Forget password')}
        />
      </View>

      <Button title="Login" onPress={() => console.log('Login')} />
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  forgetPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
});

export default LoginScreen;
