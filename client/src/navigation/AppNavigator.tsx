import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import Verification from '../screens/auth/Verification';
import CustomForm from '../screens/event/CustomForm';
import EditProfile from '../screens/profile/EditProfile';
import { getToken } from '../utils/auth';
import TabNavigator from './TabNavigator';
import { RootStackNavigatorParamsList } from './types';

const Stack = createNativeStackNavigator<RootStackNavigatorParamsList>();

const AppNavigator: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Tabs' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Tabs' component={TabNavigator} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
      <Stack.Screen name='ForgetPassword' component={ForgotPasswordScreen} />
      <Stack.Screen name='Verification' component={Verification} />
      <Stack.Screen name='CustomForm' component={CustomForm} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
