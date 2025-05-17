import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class CategoryService {
	// Lấy tất cả users
	static getAllCategory = async () => {
		return await apiInstance.get(`${baseURL}/categories`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
}

export default CategoryService;
