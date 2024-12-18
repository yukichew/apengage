import client from '.';
import { catchError } from '../utils/error';

export const getTransportation = async () => {
  try {
    const { data } = await client.get('/transport/transportation');
    return {
      success: true,
      transportation: data.transportation,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const addTransport = async (values) => {
  try {
    const { data } = await client.post('/transport/create', values);
    return {
      success: true,
      transport: data.transport,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateTransport = async (id, values) => {
  try {
    const { data } = await client.put('/transport/' + id, values);
    return {
      success: true,
      transport: data.transport,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const getTransport = async (id) => {
  try {
    const { data } = await client.get('/transport/' + id);
    return {
      success: true,
      transport: data.transport,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const deleteTransport = async (id) => {
  try {
    const { data } = await client.delete('/transport/' + id);
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const searchTransport = async (query) => {
  try {
    const { data } = await client('/transport/search?name=' + query);
    return {
      success: true,
      transportation: data.transportation,
    };
  } catch (error) {
    return catchError(error);
  }
};
