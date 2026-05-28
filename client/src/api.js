import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inventory-management-yifk.onrender.com', // change to https://inventory-management-yifk.onrender.com for production
});

export default api;
