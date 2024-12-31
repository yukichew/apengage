import { StackActions } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { signin } from '../../api/auth';
import CustomFormik from '../../components/common/CustomFormik';
import TextInput from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import TextLink from '../../components/common/TextLink';
import Title from '../../components/common/Title';
import AuthContainer from '../../components/containers/AuthContainer';
import { Props } from '../../constants/types';

const LoginScreen = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email('Invalid email')
      .matches(
        /^([a-zA-Z0-9._%+-]+)@mail\.apu\.edu\.my$/,
        'Email must be a valid APU email address'
      )
      .required('Email is required'),
    password: yup
      .string()
      .trim()
      .min(8, "Password can't be less than 8 characters")
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character'
      )
      .required('Password is required'),
  });

  const handleLogin = async (
    values: typeof initialValues,
    formikActions: any
  ) => {
    const res = await signin(values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Login Successful',
      text2: 'Welcome to the app!',
    });
    navigation.dispatch(StackActions.replace('Tabs', { user: res.user }));
    formikActions.resetForm();
  };

  return (
    <AuthContainer
      navigation={navigation}
      footer={
        <View style={styles.signUpContainer}>
          <Text style={{ fontFamily: 'Poppins-Regular' }}>
            Don't have an account?{' '}
          </Text>
          <TextLink
            text='Sign Up'
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      }
    >
      <Title text='Welcome Back!' />
      <CustomFormik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <TextInput
          placeholder='Enter email'
          name='email'
          leftIcon='mail-outline'
          leftIconLibrary='Ionicons'
        />
        <TextInput
          placeholder='Enter password'
          name='password'
          leftIcon='lock-outline'
          leftIconLibrary='MaterialIcons'
          rightIcon={showPassword ? 'eye' : 'eye-with-line'}
          rightIconLibrary='Entypo'
          secureTextEntry={!showPassword}
          onPressRightIcon={() => setShowPassword(!showPassword)}
        />
        <View style={styles.forgetPasswordContainer}>
          <TextLink
            text='Forget password?'
            onPress={() => navigation.navigate('ForgetPassword')}
          />
        </View>
        <SubmitButton title='LOGIN' />
      </CustomFormik>
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
