import client from '.';
import { catchError } from '../utils/error';

export const updateEventStatus = async (id, action) => {
  try {
    const { data } = await client.put('/event/status/' + id, {
      action,
    });
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const searchEvents = async (query) => {
  try {
    const { data } = await client('/event/search?name=' + query);
    return {
      success: true,
      events: data.events,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const searchVenueUtilization = async (query) => {
  try {
    const { data } = await client.get(
      '/event/venue-utilization/search?name=' + query
    );

    return {
      success: true,
      events: data.statistics,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};
