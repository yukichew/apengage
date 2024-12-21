import { ApiResponse, EventItem } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import { getCurrentUser } from './auth';
import client from './client';

export const addEvent = async (values: EventItem): Promise<ApiResponse> => {
  try {
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id;

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('desc', values.desc);
    formData.append('mode', values.mode);
    formData.append('type', values.type);
    formData.append('startTime', values.startTime);
    formData.append('endTime', values.endTime);
    formData.append('organizer', values.organizer);
    formData.append('postedBy', userId);

    if (values.venue) {
      formData.append('venue', values.venue);
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

export const searchEvents = async (query: string): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/event/search?name=' + query);

    return {
      success: true,
      data: response.data.events,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
