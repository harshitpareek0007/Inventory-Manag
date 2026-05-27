import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // change to https://inventory-management-yifk.onrender.com for production
});

export default api;
