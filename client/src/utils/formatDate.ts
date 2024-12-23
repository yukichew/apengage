import { format } from 'date-fns';

export const formatDateTime = (date: Date) => {
  return format(date, 'MMM, dd yyyy HH:mm:ss');
};
