import { ApiResponse, FacilityBooking } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import { getCurrentUser } from './auth';
import client from './client';

export const getFacilities = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/facility/facilities');

    const venues = response.data.facilities.map((facility: any) => ({
      key: facility.id,
      value: facility.name,
    }));

    return {
      success: true,
      data: venues,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const bookFacility = async (
  values: FacilityBooking
): Promise<ApiResponse> => {
  try {
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id;

    const response = await client.post<ApiResponse>('/facility/book', {
      facilityId: values.facilityId,
      startTime: values.startTime,
      endTime: values.endTime,
      venueBookingId: values.venueBookingId,
      createdBy: userId,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
