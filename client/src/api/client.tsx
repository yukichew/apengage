import axios from 'axios';
import { getToken } from '../utils/auth';

const client = axios.create({
  baseURL: 'http://192.168.100.87:8000/api',
});

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
