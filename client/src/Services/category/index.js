import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class CategoryService {
	// Lấy tất cả users
	getAllCategory = async () => {
		return await apiInstance.get(`${baseURL}/categories`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// // Lấy user theo ID
	// getUserById = async (userId) => {
	// 	return await apiInstance.get(`${baseURL}/users/${userId}`, {
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 	});
	// };
	// // Lấy user theo roleId
	// getUsersByRoleId = async (roleId) => {
	// 	return await apiInstance.get(`${baseURL}/users/getlistbyroleid/${roleId}`, {
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 	});
	// };
}

export default new CategoryService();
