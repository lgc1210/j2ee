import axios from "axios";
import { getStoredToken } from "../Utils/validation";

const apiInstance = axios.create({
	baseURL: process.env.REACT_APP_API,
	timeout: 30000,
	headers: { "X-Custom-Header": "foobar" },
	withCredentials: true,
});

apiInstance.interceptors.request.use(
	(config) => {
		const token = getStoredToken();
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		console.log("Error while sending request: ", error);
		return Promise.reject(error);
	}
);

apiInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		console.log("Error while getting response: ", error);
		return Promise.reject(error);
	}
);

export default apiInstance;
