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
    };

export type Props = {
  navigation: Navigation;
};

export type EventItem = {
  id: number;
  name: string;
  desc: string;
  date: Date;
  thumbnail: string;
  price: number;
  location: string;
  organizer: string;
  categories: string[];
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
