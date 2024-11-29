import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User } from '../constants/types';

export type RootStackNavigatorParamsList = {
  Login: undefined;
  SignUp: undefined;
  ForgetPassword: undefined;
  Verification: { profile: any };
  HomeScreen: undefined;
  Home: undefined;
  Profile: { user: User };
  Event: undefined;
  History: undefined;
  AddEvent: undefined;
  EventDetails: undefined;
  CustomForm: undefined;
  EditProfile: undefined;
};

export type Navigation =
  NativeStackNavigationProp<RootStackNavigatorParamsList>;
