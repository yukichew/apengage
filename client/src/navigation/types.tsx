import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackNavigatorParamsList = {
  Login: undefined;
  SignUp: undefined;
  ForgetPassword: undefined;
  Verification: { profile: any };
  HomeScreen: undefined;
  Home: undefined;
  Profile: undefined;
  Event: undefined;
  History: undefined;
  AddEvent: undefined;
  EventDetails: undefined;
  CustomForm: undefined;
};

export type Navigation =
  NativeStackNavigationProp<RootStackNavigatorParamsList>;
