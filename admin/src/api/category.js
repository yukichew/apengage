import client from '.';
import { catchError } from '../utils/error';

export const getCategories = async () => {
  try {
    const { data } = await client.get('/category/categories');
    return {
      success: true,
      categories: data.categories,
      count: data.count,
    };
  } catch (error) {
    return catchError(error);
  }
};
