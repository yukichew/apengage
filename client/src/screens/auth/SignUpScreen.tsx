import { StackActions } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { signup } from '../../api/auth';
import CustomFormik from '../../components/common/CustomFormik';
import TextInput from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import TextLink from '../../components/common/TextLink';
import Title from '../../components/common/Title';
import AuthContainer from '../../components/containers/AuthContainer';
import { Props } from '../../constants/types';

const SignUpScreen = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    fullname: '',
    email: '',
    password: '',
    apkey: '',
  };

  const validationSchema = yup.object({
    fullname: yup.string().trim().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
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
    apkey: yup.string().trim().required('APKey is required'),
  });

  const handleSignUp = async (
    values: typeof initialValues,
    formikActions: any
  ) => {
    const res = await signup(values);
    formikActions.setSubmitting(false);

    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Error',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }
    formikActions.resetForm();
    navigation.dispatch(
      StackActions.replace('Verification', { profile: res.user })
    );
  };

  return (
    <AuthContainer
      navigation={navigation}
      footer={
        <View style={styles.signUpContainer}>
          <Text style={{ fontFamily: 'Poppins-Regular' }}>
            Already have an account?{' '}
          </Text>
          <TextLink text='Login' onPress={() => navigation.navigate('Login')} />
        </View>
      }
    >
      <Title text='Create Your Account' />
      <CustomFormik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSignUp}
      >
        <TextInput
          placeholder='Enter APKey'
          name='apkey'
          leftIcon='idcard'
          leftIconLibrary='AntDesign'
        />
        <TextInput
          placeholder='Enter Full Name'
          name='fullname'
          leftIcon='user-circle'
          leftIconLibrary='FontAwesome5Icon'
        />
        <TextInput
          placeholder='Enter email'
          name='email'
          leftIcon='mail-outline'
          leftIconLibrary='Ionicons'
          secureTextEntry={false}
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
        <SubmitButton title='SIGN UP' />
      </CustomFormik>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUpScreen;
