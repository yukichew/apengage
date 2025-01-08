import client from '.';
import { catchError } from '../utils/error';

export const getDashboardData = async () => {
  try {
    const { data } = await client.get('/dashboard');

    return {
      success: true,
      data,
    };
  } catch (error) {
    return catchError(error);
  }
};
