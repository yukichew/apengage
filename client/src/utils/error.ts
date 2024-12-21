import { ApiResponse } from '../constants/types';

export const catchAxiosError = (error: any): ApiResponse => {
  if (error?.response?.data) {
    return error.response.data;
  }
  return { success: false, error: error.message };
};
