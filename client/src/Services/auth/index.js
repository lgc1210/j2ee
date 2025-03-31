import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class AuthService {
  login = async (payload) => {
    return await apiInstance.post(`${baseURL}/auth/login`, payload);
  };
  register = async (payload) => {
    return await apiInstance.post(`${baseURL}/auth/register`, payload);
  };
  logout = async () => {
    return await apiInstance.post(`${baseURL}/auth/logout`);
  };
}

export default new AuthService();
