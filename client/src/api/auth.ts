import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';

type ApiResponse = {
  success: boolean;
  message?: string;
  user?: any;
  token?: any;
  error?: string;
};

const catchAxiosError = (error: any): ApiResponse => {
  if (error?.response?.data) {
    return error.response.data;
  }
  return { success: false, error: error.message };
};

export const signup = async (values: {
  fullname: string;
  email: string;
  password: string;
  apkey: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/user/create', {
      ...values,
    });
    return {
      success: true,
      user: response.data.user,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const signin = async (values: {
  email: string;
  password: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/user/signin', {
      ...values,
    });

    const { token, user } = response.data;
    if (token) await saveToken(token);
    if (user) await AsyncStorage.setItem('currentUser', JSON.stringify(user));

    return {
      success: true,
      user: response.data.user,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const forgetPassword = async (values: {
  email: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/user/forget-password', {
      ...values,
    });
    return {
      success: true,
      token: response.data.token,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const verifyEmail = async (values: {
  otp: string;
  userId: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/user/verify-email', {
      ...values,
    });
    return {
      success: true,
      user: response.data.user,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const changePassword = async (values: {
  password: string;
}): Promise<ApiResponse> => {
  try {
    const response = await client.put<ApiResponse>('/user/change-password', {
      ...values,
    });
    return {
      success: true,
      user: response.data.user,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('currentUser');
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};

export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (e) {
    console.error('Failed to clear token:', e);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem('currentUser');
    if (user) {
      const response = await client.get(`/user/profile`);
      return response.data.user;
    }
  } catch (error) {
    return catchAxiosError(error);
  }
};
