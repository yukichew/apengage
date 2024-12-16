import client from '.';
import { catchError } from '../utils/error';

export const getVenues = async () => {
  try {
    const { data } = await client.get('/venue/venues');
    return {
      success: true,
      venues: data.venues,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const addVenue = async (values) => {
  try {
    const { data } = await client.post('/venue/create', values);
    return {
      success: true,
      venue: data.venue,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateVenue = async (id, values) => {
  try {
    const { data } = await client.put('/venue/' + id, values);
    return {
      success: true,
      venue: data.venue,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const getVenue = async (id) => {
  try {
    const { data } = await client.get('/venue/' + id);
    return {
      success: true,
      venue: data.venue,
    };
  } catch (error) {
    return catchError(error);
  }
};
