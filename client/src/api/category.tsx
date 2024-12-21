import { ApiResponse } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import client from './client';

export const getCategories = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/category/categories');

    const categories = response.data.categories.map((category: any) => ({
      key: category.id,
      value: category.name,
    }));

    return {
      success: true,
      data: categories,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
