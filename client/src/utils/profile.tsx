import client from '../api/client';

type UserData = {
  name: string;
  course: string;
  intake: string;
  contact: string;
  gender: string;
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

export const editProfile = async (
  values: UserData,
  file?: any
): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('fullname', values.name);
    formData.append('course', values.course);
    formData.append('intake', values.intake);
    formData.append('contact', values.contact);
    formData.append('gender', values.gender);

    console.log('Submitting form data:', formData);

    if (file) {
      formData.append('profile', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
    }

    const response = await client.put<ApiResponse>(
      '/user/edit-profile',
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
