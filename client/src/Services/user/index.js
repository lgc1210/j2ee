import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class UserService {
  create = async (payload) => {
    // return await apiInstance.post(`${baseURL}/users`, payload);
  };
}

export default new UserService();
