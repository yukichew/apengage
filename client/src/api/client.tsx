import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.1.11:8000/api',
});

export default client;
