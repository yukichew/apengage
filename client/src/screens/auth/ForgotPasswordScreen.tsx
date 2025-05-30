import { StackActions } from '@react-navigation/native';
import { StyleSheet, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { forgetPassword } from '../../api/auth';
import CustomFormik from '../../components/common/CustomFormik';
import TextInput from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import Title from '../../components/common/Title';
import AuthContainer from '../../components/containers/AuthContainer';
import { Props } from '../../constants/types';

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const initialValues = {
    email: '',
  };

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  const handleForgetPassword = async (
    values: typeof initialValues,
    formikActions: any
  ) => {
    const res = await forgetPassword(values);
    formikActions.setSubmitting(false);
    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Forget Password Error',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }
    formikActions.resetForm();
    Toast.show({
      type: 'success',
      text1: 'Forget Password Link Sent',
      text2: 'Check your email for a reset link',
    });
    navigation.dispatch(StackActions.replace('Login'));
  };

  return (
    <AuthContainer navigation={navigation} showBackButton>
      <Title text='Forget Password' />
      <CustomFormik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleForgetPassword}
      >
        <TextInput
          placeholder='Enter email'
          name='email'
          leftIcon='mail-outline'
          leftIconLibrary='Ionicons'
        />
        <SubmitButton title='SEND' />
        <Text style={styles.text}>
          You will receive an email with a link to reset your password.
        </Text>
      </CustomFormik>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
    margin: 12,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.9)',
  },
});

export default ForgotPasswordScreen;
