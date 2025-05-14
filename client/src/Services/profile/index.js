import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class ProfileService {
	static getAllCustomerAppointment = async (
		customerId,
		page = 0,
		size = 10
	) => {
		return await apiInstance.get(
			`${baseURL}/appointments/customer?customer_id=${customerId}&page=${page}&size=${size}`
		);
	};
}

export default ProfileService;
