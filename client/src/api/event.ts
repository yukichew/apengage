import { ApiResponse } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import client from './client';

export const addEvent = async (values: any): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/event/create', values);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const getEvents = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/event/events');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const getEventHistory = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/event/events/organized/approved');

    const events = response.data.events.map((event: any) => ({
      key: event.id,
      value: event.name,
    }));

    return {
      success: true,
      data: events,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const searchEvents = async (
  query: string,
  category?: string
): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>(
      '/event/search?name=' +
        query +
        (category ? '&categories=' + category : '')
    );

    return {
      success: true,
      data: response.data.events,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const getEvent = async (values: {
  id: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/event/' + values.id);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const getRegistration = async (values: {
  id: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/event/registration/' + values.id);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const getAttendees = async (values: {
  eventId: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>(
      '/event/registrations/' + values.eventId
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const markAttendance = async (values: { qrCodeData: any }) => {
  try {
    const response = await client.post<ApiResponse>('/event/mark-attendance', {
      qrCodeData: values.qrCodeData,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const searchOrganizedEvents = async (
  query: string
): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>(
      '/event/events/organized/search?name=' + query
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const searchParticipatedEvents = async (
  query: string
): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>(
      '/event/events/participated/search?name=' + query
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
