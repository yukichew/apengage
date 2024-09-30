import { StyleSheet } from 'react-native';
import BackButton from '../../components/common/BackButton';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/InputText';
import Title from '../../components/common/Title';
import AuthContainer from '../../components/containers/AuthContainer';
import { Navigation } from '../../navigation/types';

type Props = {
  navigation: Navigation;
};

const ForgotPasswordScreen = ({ navigation }: Props) => {
  return (
    <AuthContainer>
      <BackButton onPress={() => navigation.goBack()} />
      <Title text='Forget Password' />
      <TextInput
        value=''
        placeholder='Enter email'
        onChangeText={() => console.log('Email')}
        leftIcon='mail-outline'
        leftIconLibrary='Ionicons'
      />
      <Button title='SEND' onPress={() => console.log('Send Link')} />
    </AuthContainer>
  );
};

const styles = StyleSheet.create({});

export default ForgotPasswordScreen;
