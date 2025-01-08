import client from '.';
import { catchError } from '../utils/error';

export const searchUser = async (query) => {
  try {
    const { data } = await client.get(`/admin/search?${query}`);
    return {
      success: true,
      users: data.users,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateUserStatus = async (id, action) => {
  try {
    const { data } = await client.put('/admin/status/' + id, { action });
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const getUser = async (id) => {
  try {
    const { data } = await client.get('/admin/' + id);
    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const addAdmin = async (values) => {
  try {
    const { data } = await client.post('/admin/create', values);
    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const updateAdmin = async (id, values) => {
  try {
    const { data } = await client.put('/admin/' + id, values);
    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const searchAbsentUser = async (query) => {
  try {
    const { data } = await client.get(`/admin/users/absent/search?${query}`);
    return {
      success: true,
      users: data.users,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};
