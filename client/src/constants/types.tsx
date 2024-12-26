import { Navigation } from '../navigation/types';

export type Field =
  | {
      id: string;
      type: 'short_ans' | 'long_ans' | 'file';
      label: string;
      placeholder?: string;
      required?: boolean;
      maxLength?: number;
      defaultValue?: string;
      defaultField?: boolean;
      value?: string;
    }
  | {
      id: string;
      type: 'mcq' | 'dropdown' | 'checkbox';
      label: string;
      placeholder?: string;
      required?: boolean;
      options: string[];
      selectedOptions?: string[];
      defaultValue?: string;
      defaultField?: boolean;
      value?: string;
    };

export type Props = {
  navigation: Navigation;
};

export type EventItem = {
  id?: number;
  name: string;
  mode: string;
  type: string;
  desc: string;
  startTime: Date;
  endTime: Date;
  organizer: string;
  thumbnail?: any;
  price?: number;
  venue?: string;
  location?: string;
  categories?: string[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  apkey: string;
  profile: string;
  gender: string;
  course: string;
  intake: string;
  nric: string;
};

export type ApiResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
};

export type VenueBooking = {
  venueId: string;
  startTime: string;
  endTime: string;
  purpose: string;
};

export type FacilityBooking = {
  facilityId: string;
  startTime: string;
  endTime: string;
  venueBookingId: string;
};

export type Feedback = {
  id?: number;
  registration: string;
  rating: number;
  comment: string;
};
