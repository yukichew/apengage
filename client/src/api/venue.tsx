import { ApiResponse, VenueBooking } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import client from './client';

export const getVenues = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/venue/venues');

    const venues = response.data.venues.map((venue: any) => ({
      key: venue.id,
      value: venue.name,
    }));

    return {
      success: true,
      data: venues,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const bookVenue = async (values: VenueBooking): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/venue/book', {
      venueId: values.venueId,
      startTime: values.startTime,
      endTime: values.endTime,
      purpose: values.purpose,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const getVenueBookings = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/venue/bookings');

    const venues = response.data.bookings.map((booking: any) => ({
      key: booking.id,
      value: booking.venue,
    }));

    return {
      success: true,
      data: venues,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
