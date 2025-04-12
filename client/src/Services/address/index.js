import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class AddressService {
	static getProvinces = async () => {
		return await apiInstance.get(`${baseURL}/addresses/provinces`);
	};

	static getByUserId = async (userId) => {
		return await apiInstance.get(
			`${baseURL}/addresses/users/?user_id=${userId}`
		);
	};

	static create = async (payload) => {
		return await apiInstance.post(`${baseURL}/addresses`, payload);
	};

	static update = async (id, payload) => {
		return await apiInstance.put(`${baseURL}/addresses/${id}`, payload);
	};

	static delete = async (id) => {
		return await apiInstance.delete(`${baseURL}/addresses/${id}`);
	};

	static setDefault = async (id) => {
		return await apiInstance.put(`${baseURL}/addresses/${id}`);
	};
}

export default AddressService;
