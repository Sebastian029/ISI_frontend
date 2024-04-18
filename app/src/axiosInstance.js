import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000/', 
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
