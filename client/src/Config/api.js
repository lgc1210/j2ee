import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
});

apiInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default apiInstance;
