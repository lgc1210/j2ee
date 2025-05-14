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
}

export default ServiceService;
