import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class UserService {
  changePassword = async (userId, payload) => {
    return await apiInstance.post(
      `${baseURL}/users/${userId}/changepassword`,
      payload
    );
  };
}

export default new UserService();
