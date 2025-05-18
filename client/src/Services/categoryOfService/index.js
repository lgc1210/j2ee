import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class CategoryOfServiceService {
	// Lấy tất cả Category Of Service
	getAllCategoryOfServices = async () => {
		return await apiInstance.get(`${baseURL}/categoryOfServices`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Lấy Category Of Service  theo ID
	getCategoryOfServicesById = async (categoryOfServiceId) => {
		return await apiInstance.get(
			`${baseURL}/categoryOfServices/${categoryOfServiceId}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	};

	// Tạo Category Of Service  mới
	createCategoryOfServices = async (payload) => {
		return await apiInstance.post(`${baseURL}/categoryOfServices`, payload, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	};

	// Cập nhật Category Of Service
	updateCategoryOfServices = async (categoryOfServiceId, payload) => {
		return await apiInstance.put(
			`${baseURL}/categoryOfServices/${categoryOfServiceId}`,
			payload,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
	};

	// Xóa một Category Of Service
	deleteCategoryOfService = async (categoryOfServiceId) => {
		return await apiInstance.delete(
			`${baseURL}/categoryOfServices/${categoryOfServiceId}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	};

	// Xóa nhiều Category Of Service
	deleteMultipleCategoryOfServices = async (categoryOfServiceIds) => {
		return await apiInstance.delete(
			`${baseURL}/categoryOfServices/delete-multiple`,
			{
				data: categoryOfServiceIds,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	};
}

export default new CategoryOfServiceService();
