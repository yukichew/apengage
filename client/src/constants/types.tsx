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
