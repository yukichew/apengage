import { ApiResponse, TransportBooking } from '../constants/types';
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

export const bookTransport = async (
  values: TransportBooking
): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/transport/book', {
      transportType: values.transportType,
      departFrom: values.departFrom,
      departTo: values.departTo,
      returnTo: values.returnTo,
      departDate: values.departDate,
      returnDate: values.returnDate,
      eventId: values.eventId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
