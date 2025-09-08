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
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || 'An error occurred';
      console.log("axios Error:=", message," at status:=", status);
    } else {
      toast.error('Network error or server unavailable.');
    }
    return Promise.reject(error);
  }
);

export default apiServer;