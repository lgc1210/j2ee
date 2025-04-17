import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class AddressService {
	static getProvinces = async () => {
		return await apiInstance.get(`${baseURL}/addresses/provinces`);
	};

	static getAllByUserId = async (userId, page = 0, size = 4) => {
		return await apiInstance.get(
			`${baseURL}/addresses/users/${userId}?page=${page}&size=${size}`
		);
	};

	static create = async (payload) => {
		return await apiInstance.post(`${baseURL}/addresses`, payload);
	};

	static update = async (id, payload) => {
		return await apiInstance.put(`${baseURL}/addresses/update/${id}`, payload);
	};

	static delete = async (id) => {
		return await apiInstance.delete(`${baseURL}/addresses/${id}`);
	};

	static setDefault = async (id, payload) => {
		return await apiInstance.put(`${baseURL}/addresses/${id}`, payload);
	};
}

export default AddressService;
