import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { EventItem } from '../constants/types';
import { getEvents } from '../utils/eventManagement';

export const useEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await getEvents();
    if (res.success) {
      setEvents(res.data);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch events',
        text2: res.error,
        position: 'top',
        topOffset: 60,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    events,
    loading,
    refreshEvents: fetchData,
  };
};
