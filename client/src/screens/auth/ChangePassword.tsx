import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { changePassword } from '../../api/auth';
import CustomFormik from '../../components/common/CustomFormik';
import TextInput from '../../components/common/InputText';
import SubmitButton from '../../components/common/SubmitButton';
import AppContainer from '../../components/containers/AppContainer';
import { Props } from '../../constants/types';

const ChangePassword = ({ navigation }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const initialValues = {
    password: '',
  };

  const validationSchema = yup.object({
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

  const handleChangePassword = async (
    values: typeof initialValues,
    formikActions: any
  ) => {
    const res = await changePassword(values);
    formikActions.setSubmitting(false);
    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: 'Change Password Error',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
      return;
    }
    formikActions.resetForm();
    Toast.show({
      type: 'success',
      text1: 'Change Password',
      text2: 'Password has been changed successfully',
    });
  };

  return (
    <AppContainer navigation={navigation} showBackButton>
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={{
            fontFamily: 'Poppins-Bold',
            fontSize: 18,
            marginTop: 10,
            marginBottom: 4,
          }}
        >
          Change Password
        </Text>
        <CustomFormik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleChangePassword}
        >
          <TextInput
            placeholder='Enter new password'
            name='password'
            leftIcon='lock-outline'
            leftIconLibrary='MaterialIcons'
            rightIcon={showPassword ? 'eye' : 'eye-with-line'}
            rightIconLibrary='Entypo'
            secureTextEntry={!showPassword}
            onPressRightIcon={() => setShowPassword(!showPassword)}
          />
          <SubmitButton title='Save' />
        </CustomFormik>
      </View>
    </AppContainer>
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

export default ChangePassword;
