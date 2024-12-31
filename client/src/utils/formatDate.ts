import { format } from 'date-fns';

export const formatDateTime = (date: Date) => {
  return format(date, 'dd MMM yy HH:mm');
};

export const formatTime = (date: Date) => {
  return format(date, 'hh:mm a');
};

export const formatDate = (date: Date) => {
  return format(date, 'dd MMM yyyy (EEEE)');
};
