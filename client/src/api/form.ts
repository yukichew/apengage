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

export const joinEvent = async (values: {
  formId: string;
  response: any;
}): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>(
      `/form/${values.formId}/join`,
      {
        response: values.response,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const getForm = async (values: {
  eventId: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.get<any>('/form/' + values.eventId);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};