import client from '../api/client';

type SignUpData = {
  fullname: string;
  email: string;
  password: string;
  apkey: string;
};

type SigninData = {
  email: string;
  password: string;
};

type ForgetPasswordData = {
  email: string;
};

type VerifyEmailData = {
  otp: string;
  userId: string;
};

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

export const signup = async (values: SignUpData): Promise<ApiResponse> => {
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

export const signin = async (values: SigninData): Promise<ApiResponse> => {
  try {
    const response = await client.post<ApiResponse>('/user/signin', {
      ...values,
    });
    return {
      success: true,
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error: any) {
    return catchAxiosError(error);
  }
};

export const forgetPassword = async (
  values: ForgetPasswordData
): Promise<ApiResponse> => {
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

export const verifyEmail = async (
  values: VerifyEmailData
): Promise<ApiResponse> => {
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
