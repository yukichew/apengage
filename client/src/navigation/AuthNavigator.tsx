import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SignUpScreen from '../screens/user/SignUpScreen';
import { RootStackNavigatorParamsList } from './types';

const Stack = createNativeStackNavigator<RootStackNavigatorParamsList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name='Login' component={LoginScreen} /> */}
      <Stack.Screen name='SignUp' component={SignUpScreen} />
      {/* <Stack.Screen name='ForgetPassword' component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
