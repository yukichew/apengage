import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import Verification from '../screens/auth/Verification';
import TabNavigator from './TabNavigator';
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
      <Stack.Screen name='HomeScreen' component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
