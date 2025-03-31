import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class UserService {
  changePassword = async (userId, payload) => {
    return await apiInstance.post(
      `${baseURL}/users/${userId}/changepassword`,
      {
        currentPassword: payload["currentPassword"],
        newPassword: payload["newPassword"],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };
}

export default new UserService();
