import { format } from 'date-fns';

export const formatDateTime = (dateString) => {
  return format(new Date(dateString), 'MMM, dd yyyy HH:mm:ss');
};
