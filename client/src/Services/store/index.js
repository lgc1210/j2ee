import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class StoreService {
	// Lấy tất cả store
	static getAll = async ({ page, pageSize, categoryOfServiceId }) => {
		return await apiInstance.get(`${baseURL}/stores`, {
			params: { page, size: pageSize, categoryOfServiceId },
		});
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
	// Lấy Store  theo ID
	static getStoreById = async (roleId) => {
		return await apiInstance.get(`${baseURL}/stores/${roleId}`, {
			headers: {
				"Content-Type": "application/json",
			},
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
				"Content-Type": "application/json",
			},
		});
	};
}

export default StoreService;
