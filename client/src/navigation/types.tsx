import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventItem, User } from '../constants/types';

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
  EventDetails: { event: EventItem };
  CustomForm: { eventId: string };
  EditProfile: undefined;
  ProfileStack: { user: User };
  BookVenue: undefined;
  BookTransport: undefined;
  BookFacility: undefined;
  ParticipantForm: { eventId: string };
  Ticket: { registration: any };
  QRCodeScan: undefined;
};

export type Navigation =
  NativeStackNavigationProp<RootStackNavigatorParamsList>;
