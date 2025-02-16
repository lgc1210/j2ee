import axios from "axios";

const apiInstance = axios.create();

apiInstance.interceptors.request.use(
  (response) => {},
  (error) => {}
);

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {}
);
