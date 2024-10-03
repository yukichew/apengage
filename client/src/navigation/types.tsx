import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackNavigatorParamsList = {
  Login: undefined;
  SignUp: undefined;
  ForgetPassword: undefined;
  Verification: { profile: any };
  Home: undefined;
};

export type Navigation =
  NativeStackNavigationProp<RootStackNavigatorParamsList>;
