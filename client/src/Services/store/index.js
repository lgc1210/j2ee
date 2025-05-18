import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class StoreService {
	// Get all stores for customer with pagination
	static getAll = async ({ page, pageSize, categoryOfServiceId }) => {
		return await apiInstance.get(`${baseURL}/stores`, {
			params: { page, size: pageSize, categoryOfServiceId },
		});
	};

	// Get all stores for admin with no pagination
	static getAllForAdmin = async () => {
		return await apiInstance.get(`${baseURL}/stores/admin`);
	};

	// Get store for ownerId
	static getStoreByOwnerId = async (ownerId) => {
		return await apiInstance.get(`${baseURL}/stores/admin/owners/${ownerId}`);
	};

	// Get store by id
	static getStoreById = async (storeId) => {
		return await apiInstance.get(`${baseURL}/stores/${storeId}`);
	};

	static getStoreCloseTimeById = async (store_id) => {
		return await apiInstance.get(
			`${baseURL}/stores/close_time?store_id=${store_id}`
		);
	};

	// Xóa nhiều Store
	static deleteMultipleStores = async (storeIds) => {
		return await apiInstance.delete(`${baseURL}/stores/delete-multiple`, {
			data: storeIds,
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
	// Import Stores
	static importStores = async (stores) => {
		return await apiInstance.post(`${baseURL}/stores/import`, stores, {
			headers: { "Content-Type": "application/json" },
		});
	};

	static getStoreBylogin = async () => {
		return await apiInstance.get(`${baseURL}/stores/mystore`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Cập nhật Store
	static updateStore = async (storeId, payload) => {
		return await apiInstance.put(`${baseURL}/stores/${storeId}`, payload, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	};

	// Delete Store
	static deleteStore = async (storeId) => {
		return await apiInstance.delete(`${baseURL}/stores/${storeId}`);
	};
}

export default StoreService;
