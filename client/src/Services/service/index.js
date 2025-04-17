import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class ServiceService {
	static getAllByStoreId = async (storeId) => {
		return await apiInstance.get(`${baseURL}/services/${storeId}`);
	};
}

export default ServiceService;
