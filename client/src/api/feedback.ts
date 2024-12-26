import { ApiResponse, Feedback } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import client from './client';

export const createFeedback = async (
  values: Feedback
): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/feedback/create', {
      registration: values.registration,
      comment: values.comment,
      rating: values.rating,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
