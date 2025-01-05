import client from '.';
import { catchError } from '../utils/error';

export const getFacilities = async () => {
  try {
    const { data } = await client.get('/facility/facilities');
    return {
      success: true,
      facilities: data.facilities,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const addFacility = async (values) => {
  try {
    const { data } = await client.post('/facility/create', values);
    return {
      success: true,
      facility: data.facility,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateFacility = async (id, values) => {
  try {
    const { data } = await client.put('/facility/' + id, values);
    return {
      success: true,
      facility: data.facility,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const getFacility = async (id) => {
  try {
    const { data } = await client.get('/facility/' + id);
    return {
      success: true,
      facility: data.facility,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const deleteFacility = async (id) => {
  try {
    const { data } = await client.delete('/facility/' + id);
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const searchFacility = async (query) => {
  try {
    const { data } = await client.get('/facility/search?name=' + query);
    return {
      success: true,
      facilities: data.facilities,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const getFacilityBookings = async () => {
  try {
    const { data } = await client.get('/facility/bookings');
    return {
      success: true,
      bookings: data.bookings,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateBookingStatus = async (id, action) => {
  try {
    const { data } = await client.put('/facility/booking/status/' + id, {
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

export const searchFacilityBookings = async (query) => {
  try {
    const { data } = await client.get(
      '/facility/bookings/search?name=' + query
    );
    return {
      success: true,
      bookings: data.bookings,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateFacilityStatus = async (id, action) => {
  try {
    const { data } = await client.put('/facility/status/' + id, {
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
