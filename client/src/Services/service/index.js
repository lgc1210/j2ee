import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class ServiceService {
	static getAllByStoreId = async (storeId, page = 0, size = 10) => {
		console.log("Store id:", storeId);
		return await apiInstance.get(
			`${baseURL}/services/stores/${storeId}?page=${page}&size=${size}`
		);
	};

	static getAllStaffAvailability = async (serviceId, storeId, date) => {
		return await apiInstance.get(
			`${baseURL}/availability/service/${serviceId}/store/${storeId}?date=${date}`
		);
	};

	// Lấy danh sách tất cả dịch vụ
	static getAllServices = async () => {
		return await apiInstance.get(`${baseURL}/services/ListServices`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	static getAllCategories = async () => {
		return await apiInstance.get(`${baseURL}/categoryOfServices`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Tạo sản phẩm
	static createService = async (payload) => {
		try {
			return await apiInstance.post(`${baseURL}/services`, payload, {
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch (error) {
			if (error.response?.status === 409) {
				throw new Error("Sản phẩm đã tồn tại. Vui lòng thử lại.");
			}
			throw error.response?.data || error.message;
		}
	};

	// Cập nhật sản phẩm
	static updateService = async (serviceId, payload) => {
		return await apiInstance.put(`${baseURL}/services/${serviceId}`, payload, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Xóa sản phẩm
	static deleteService = async (serviceId) => {
		return await apiInstance.delete(`${baseURL}/services/${serviceId}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Xóa nhiều sản phẩm
	static deleteMultipleServices = async (serviceIds) => {
		return await apiInstance.delete(`${baseURL}/services`, {
			data: serviceIds,
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
}

export default ServiceService;
