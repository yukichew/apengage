import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/InputText';
import TextLink from '../../components/common/TextLink';
import Title from '../../components/common/Title';
import AuthContainer from '../../components/containers/AuthContainer';
import { Navigation } from '../../navigation/types';

type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
  return (
    <AuthContainer
      footer={
        <View style={styles.signUpContainer}>
          <Text>Don't have an account? </Text>
          <TextLink
            text='Sign Up'
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      }
    >
      <Title text='Welcome Back' />

      <TextInput
        value=''
        placeholder='Enter Email'
        onChangeText={() => console.log('Email')}
        leftIcon='mail-outline'
        leftIconLibrary='Ionicons'
      />

      <TextInput
        value=''
        placeholder='Enter Password'
        onChangeText={() => console.log('Password')}
        leftIcon='lock-outline'
        leftIconLibrary='MaterialIcons'
      />

      <View style={styles.forgetPasswordContainer}>
        <TextLink
          text='Forget password?'
          onPress={() => navigation.navigate('ForgetPassword')}
        />
      </View>

      <Button title='LOGIN' onPress={() => console.log('Login')} />
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  forgetPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
