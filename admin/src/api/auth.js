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
