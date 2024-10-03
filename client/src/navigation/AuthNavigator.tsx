import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import Home from '../screens/Home';
import ForgotPasswordScreen from '../screens/user/ForgotPasswordScreen';
import LoginScreen from '../screens/user/LoginScreen';
import SignUpScreen from '../screens/user/SignUpScreen';
import Verification from '../screens/user/Verification';
import { RootStackNavigatorParamsList } from './types';

const Stack = createNativeStackNavigator<RootStackNavigatorParamsList>();

const AuthNavigator: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
      <Stack.Screen name='ForgetPassword' component={ForgotPasswordScreen} />
      <Stack.Screen name='Verification' component={Verification} />
      <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
