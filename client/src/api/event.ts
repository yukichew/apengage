import { ApiResponse, EventItem } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import client from './client';

export const addEvent = async (values: EventItem): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('desc', values.desc);
    formData.append('mode', values.mode);
    formData.append('type', values.type);
    formData.append('startTime', values.startTime);
    formData.append('endTime', values.endTime);
    formData.append('organizer', values.organizer);

    if (values.venueBooking) {
      formData.append('venueBooking', values.venueBooking);
    }

    if (values.price) {
      formData.append('price', Number(values.price));
    }

    if (values.location) {
      formData.append('location', values.location);
    }

    if (values.categories) {
      values.categories.forEach((category) => {
        formData.append('categories[]', category);
      });
    }

    if (values.thumbnail) {
      formData.append('thumbnail', {
        uri: values.thumbnail.uri,
        type: values.thumbnail.type,
        name: values.thumbnail.name,
      });
    }

    console.log('formData', formData);
    const response = await client.post<ApiResponse>('/event/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

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

export const getParticipatedEvents = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/event/events/participated');

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const getOrganizedEvents = async (): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/event/events/organized');

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
