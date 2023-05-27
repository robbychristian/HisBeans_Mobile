import axios from 'axios';

export const DEV_URL = 'http://10.0.2.2:8000/';

export const api = axios.create({
  baseURL: DEV_URL,
});

api.defaults.timeout = 60000;
