import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000/', // Set your base URL here
  timeout: 5000, // Set timeout (milliseconds) for requests
  headers: {
    'Content-Type': 'application/json',
    // Add any default headers you need
  },
});

// You can also add interceptors for request and response here if needed
// For example, to handle errors globally

instance.interceptors.response.use(
  response => {
    // Do something with successful response
    return response;
  },
  error => {
    // Do something with error response
    return Promise.reject(error);
  }
);

export default instance;
