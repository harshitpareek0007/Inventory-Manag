import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inventory-manag-1.onrender.com', 
});

export default api;
