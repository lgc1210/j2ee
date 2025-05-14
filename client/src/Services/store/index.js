import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class StoreService {
	// Lấy tất cả store
	static getAll = async (page = 0, size = 5) => {
		return await apiInstance.get(`${baseURL}/stores?page=${page}&size=${size}`);
	};

	static getStoreCloseTimeById = async (store_id) => {
		return await apiInstance.get(
			`${baseURL}/stores/close_time?store_id=${store_id}`
		);
	};

	// Xóa nhiều Store
	deleteMultipleStores = async (storeIds) => {
		return await apiInstance.delete(`${baseURL}/stores/delete-multiple`, {
			data: storeIds,
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
	// Import Stores
	importStores = async (stores) => {
		return await apiInstance.post(`${baseURL}/stores/import`, stores, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
}

export default StoreService;
