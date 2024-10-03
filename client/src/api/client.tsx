import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.100.26:8000/api',
});

export default client;
