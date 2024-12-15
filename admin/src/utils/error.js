export const catchError = (error) => {
  if (error?.response?.data) {
    return error.response.data;
  }
  return { success: false, error: error.message };
};
