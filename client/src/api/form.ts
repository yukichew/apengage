import { ApiResponse, Field } from '../constants/types';
import { catchAxiosError } from '../utils/error';
import client from './client';

export const createForm = async (values: {
  eventId: string;
  fields: Field[];
  deadline: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/form/create', {
      eventId: values.eventId,
      fields: values.fields,
      deadline: values.deadline,
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
  file?: any;
}): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('response', JSON.stringify(values.response));

    if (values.file) {
      console.log(values.file);
      formData.append('file', {
        uri: values.file.uri,
        type: values.file.type,
        name: values.file.name,
      });
    }

    const response = await client.post<ApiResponse>(
      `/form/${values.formId}/join`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
