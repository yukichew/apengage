import { ApiResponse, Field } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import client from './client';

export const createForm = async (values: {
  eventId: string;
  fields: Field[];
}): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/form/create', {
      eventId: values.eventId,
      fields: values.fields,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};
