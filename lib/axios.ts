'use client';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});



apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Error in axoins use ', error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || 'An error occurred';
      console.log('pass 1 ');

      switch (status) {
        case 401:
          toast.error(`Unauthorized: ${message}`);
          break;
        case 403:
          toast.error(`Forbidden: ${message}`);
          break;
        case 404:
          toast.error(`Not Found: ${message}`);
          break;
        case 409:
          console.log(`Conflict: ${message}`);
          // toast.error(`Conflict: ${message}`);
          break;
        default:
          toast.error(`Server Error: ${message}`);
      }
    } else {
      toast.error('Network error or server unavailable.');
    }
    return Promise.reject(error);
  }
);

export default apiServer;