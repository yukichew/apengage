import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getToken } from '../api/auth';
import ChangePassword from '../screens/auth/ChangePassword';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import Verification from '../screens/auth/Verification';
import EventDetails from '../screens/event/EventDetails';
import CustomForm from '../screens/event/organizer/CustomForm';
import QRCodeScan from '../screens/event/organizer/QRCodeScan';
import ParticipantForm from '../screens/event/participant/ParticipantForm';
import Ticket from '../screens/event/participant/Ticket';
import Dashboard from '../screens/History/Dashboard';
import FacilityForm from '../screens/logistics/FacilityForm';
import TransportForm from '../screens/logistics/TransportForm';
import VenueForm from '../screens/logistics/VenueForm';
import EditProfile from '../screens/profile/EditProfile';
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

    const authMonitor = setInterval(async () => {
      const token = await getToken();
      if (!token) {
        setIsAuthenticated(false);
        clearInterval(authMonitor);
      }
    }, 3000);

    return () => clearInterval(authMonitor);
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
      <Stack.Screen name='EventDetails' component={EventDetails} />
      <Stack.Screen name='BookVenue' component={VenueForm} />
      <Stack.Screen name='BookFacility' component={FacilityForm} />
      <Stack.Screen name='BookTransport' component={TransportForm} />
      <Stack.Screen name='ParticipantForm' component={ParticipantForm} />
      <Stack.Screen name='Ticket' component={Ticket} />
      <Stack.Screen name='Dashboard' component={Dashboard} />
      <Stack.Screen name='QRCodeScan' component={QRCodeScan} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
