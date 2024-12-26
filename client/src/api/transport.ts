import { ApiResponse } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import client from './client';

export const getTransportBookingHistory = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<ApiResponse>('/transport/bookings');
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
