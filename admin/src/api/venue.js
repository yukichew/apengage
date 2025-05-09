import client from '.';
import { catchError } from '../utils/error';

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

export const deleteVenue = async (id) => {
  try {
    const { data } = await client.delete('/venue/' + id);
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const searchVenue = async (query) => {
  try {
    const { data } = await client.get('/venue/search?name=' + query);
    return {
      success: true,
      venues: data.venues,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateBookingStatus = async (id, action) => {
  try {
    const { data } = await client.put('/venue/booking/status/' + id, {
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

export const searchVenueBookings = async (query) => {
  try {
    const { data } = await client('/venue/bookings/search?name=' + query);
    return {
      success: true,
      bookings: data.bookings,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateVenueStatus = async (id, action) => {
  try {
    const { data } = await client.put('/venue/status/' + id, {
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
