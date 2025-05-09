import { jwtDecode } from 'jwt-decode';
import client from '.';
import { catchError } from '../utils/error';

export const login = async (values) => {
  try {
    const { data } = await client.post('/user/signin', values);
    await sessionStorage.setItem('token', data.token);
    return {
      success: true,
      admin: data.user,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const getToken = async () => {
  try {
    return await sessionStorage.getItem('token');
  } catch (error) {
    return catchError(error);
  }
};

export const getUserRole = async () => {
  try {
    const token = await getToken();
    if (!token) return null;
    const decodedToken = jwtDecode(token);
    return decodedToken.role;
  } catch (error) {
    return catchError(error);
  }
};

export const logout = async () => {
  try {
    await sessionStorage.removeItem('token');
    return { success: true };
  } catch (error) {
    return catchError(error);
  }
};

export const resetPassword = async (values) => {
  try {
    const { data } = await client.post('/user/reset-password', values);
    return {
      success: true,
      admin: data.user,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const getProfile = async () => {
  try {
    const { data } = await client.get('/user/profile');
    return {
      success: true,
      admin: data.user,
    };
  } catch (error) {
    return catchError(error);
  }
};

export const changePassword = async (values) => {
  try {
    const { data } = await client.put('/user/change-password', values);
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return catchError(error);
  }
};
