import axios from 'axios';

const api = axios.create({
  baseURL: 'https://xox-74vw.onrender.com' || 'http://localhost:5000/api',
});

export default api;
