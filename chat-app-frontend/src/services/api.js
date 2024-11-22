import axios from 'axios';

const baseURL =
  process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === 'production'
    ? (() => { throw new Error("REACT_APP_BACKEND_URL is not defined in production"); })()
    : 'http://localhost:5000/api');

const api = axios.create({ baseURL });

export default api;
