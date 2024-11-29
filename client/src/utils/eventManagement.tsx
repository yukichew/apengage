import client from '../api/client';
import { EventItem } from '../constants/types';
import { getCurrentUser } from './auth';

type EventData = {
  name: string;
  desc: string;
  location: string;
  price: string;
  date: string;
  categories: string[];
  organizer: string;
  postedBy?: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
  events?: any;
};

const catchAxiosError = (error: any): ApiResponse => {
  if (error?.response?.data) {
    return error.response.data;
  }
  return { success: false, error: error.message };
};

export const addEvent = async (
  values: EventData,
  file: any
): Promise<ApiResponse> => {
  try {
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id;

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('desc', values.desc);
    formData.append('date', values.date);
    formData.append('location', values.location);
    formData.append('organizer', values.organizer);
    formData.append('postedBy', userId);
    formData.append('price', Number(values.price));

    values.categories.forEach((category) => {
      formData.append('categories[]', category);
    });

    if (file) {
      formData.append('thumbnail', {
        uri: file.uri,
        type: file.type,
        name: file.name,
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

export const addFields = async (
  values: EventData,
  file: any
): Promise<ApiResponse> => {
  try {
    const currentUser = await getCurrentUser();
    const userId = currentUser?.id;

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('desc', values.desc);
    formData.append('date', values.date);
    formData.append('location', values.location);
    formData.append('organizer', values.organizer);
    formData.append('postedBy', userId);
    formData.append('price', Number(values.price));

    values.categories.forEach((category) => {
      formData.append('categories[]', category);
    });

    if (file) {
      formData.append('thumbnail', {
        uri: file.uri,
        type: file.type,
        name: file.name,
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
    const response = await client.get<ApiResponse>('/event/events');

    const events = response.data.events.map((event: EventItem) => ({
      id: event.id,
      name: event.name,
      desc: event.desc,
      date: new Date(event.date).toLocaleDateString(),
      location: event.location,
      categories: event.categories,
      price: event.price,
      organizer: event.organizer,
      thumbnail: event.thumbnail,
    }));

    return {
      success: true,
      data: events,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
