import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inventory-manag.onrender.com', 
});

export default api;
