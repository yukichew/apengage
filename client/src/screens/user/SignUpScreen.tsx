import { StyleSheet, Text, View } from 'react-native';
import * as yup from 'yup';
import Button from '../../components/common/Button';
import CustomFormik from '../../components/common/CustomFormik';
import TextInput from '../../components/common/InputText';
import TextLink from '../../components/common/TextLink';
import Title from '../../components/common/Title';
import AuthContainer from '../../components/containers/AuthContainer';
import { Navigation } from '../../navigation/types';

type Props = {
  navigation: Navigation;
};

const SignUpScreen = ({ navigation }: Props) => {
  const initialValues = {
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSignUp = (values: typeof initialValues, formikActions: any) => {
    console.log(values);
  };

  return (
    <AuthContainer
      footer={
        <View style={styles.signUpContainer}>
          <Text>Already have an account? </Text>
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
        />
        <TextInput
          placeholder='Enter password'
          name='password'
          leftIcon='lock-outline'
          leftIconLibrary='MaterialIcons'
          rightIcon='eye-with-line'
          rightIconLibrary='Entypo'
        />
        <TextInput
          placeholder='Confirm password'
          name='confirmPassword'
          leftIcon='lock-outline'
          leftIconLibrary='MaterialIcons'
          rightIcon='eye-with-line'
          rightIconLibrary='Entypo'
        />
        <Button title='SIGN UP' />
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
