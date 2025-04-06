import apiInstance from "../../Config/api";
import { getStoredToken } from "../../Utils/validation";

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
	updateUser = async (userId, payload) => {
		return await apiInstance.put(`${baseURL}/users/${userId}`, payload);
	};
	getUserProfile = async () => {
		const token = getStoredToken();
		if (!token) {
			throw new Error("No token found");
		}
		return await apiInstance.get(`${baseURL}/users/me`);
	};
}

export default new UserService();
