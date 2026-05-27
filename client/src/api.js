import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inventory-management-yifk.onrender.com',
});

export default api;
