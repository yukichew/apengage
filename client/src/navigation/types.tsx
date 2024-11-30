import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User } from '../constants/types';

export type RootStackNavigatorParamsList = {
  Login: undefined;
  SignUp: undefined;
  ForgetPassword: undefined;
  Verification: { profile: any };
  Tabs: undefined;
  Home: undefined;
  Profile: undefined;
  Event: undefined;
  History: undefined;
  AddEvent: undefined;
  EventDetails: undefined;
  CustomForm: undefined;
  EditProfile: undefined;
  ProfileStack: { user: User };
};

export type Navigation =
  NativeStackNavigationProp<RootStackNavigatorParamsList>;
