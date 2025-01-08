import axios from 'axios';
import { getToken, logout } from './auth';

const client = axios.create({ baseURL: 'http://192.168.100.111:8000/api' });

client.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await logout();
      window.location.replace('/');
    }
    return Promise.reject(error);
  }
);

export default client;
