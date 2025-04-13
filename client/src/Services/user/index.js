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

	// Lấy tất cả users
	getAllUses = async () => {
		return await apiInstance.get(`${baseURL}/users`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Lấy user theo ID
	getUserById = async (userId) => {
		return await apiInstance.get(`${baseURL}/users/${userId}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
	// Lấy user theo roleId
	getUsersByRoleId = async (roleId) => {
		return await apiInstance.get(`${baseURL}/users/getlistbyroleid/${roleId}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Tạo user mới
	createUser = async (payload) => {
		try {
			return await apiInstance.post(`${baseURL}/users/createUser`, payload, {
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch (error) {
			if (error.response?.status === 409) {
				throw new Error(
					"Email hoặc số điện thoại đã được sử dụng. Vui lòng thử lại."
				);
			}
			throw error.response?.data || error.message;
		}
	};

	// Xóa một Store
	deleteUser = async (userId) => {
		return await apiInstance.delete(`${baseURL}/users/${userId}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Xóa nhiều Store
	deleteMultipleUsers = async (userIds) => {
		return await apiInstance.delete(`${baseURL}/users/delete-multiple`, {
			data: userIds,
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
}

export default new UserService();
