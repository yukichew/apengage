import axios from 'axios';
import { getToken } from './auth';

const client = axios.create({ baseURL: 'http://localhost:8000/api' });

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

export default client;
