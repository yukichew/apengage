import client from '../api/client';

type CategoryData = {
  name: string;
  desc: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  error?: string;
  categories?: any;
};

const catchAxiosError = (error: any): ApiResponse => {
  if (error?.response?.data) {
    return error.response.data;
  }
  return { success: false, error: error.message };
};

export const getCategories = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<ApiResponse>('/category/categories');

    const categories = response.data.categories.map((category: any) => ({
      key: category.id,
      value: category.name,
    }));

    return {
      success: true,
      categories,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
