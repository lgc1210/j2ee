import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class ProductService {
	static getAllProductByStoreId = async (
		storeId,
		page = 0,
		name = "",
		category = ""
	) => {
		return await apiInstance.get(
			`${baseURL}/products/stores?store_id=${storeId}&page=${page}&name=${name}&category=${category}`
		);
	};

	static getProductDetails = async (productId) => {
		return await apiInstance.get(
			`${baseURL}/products/details?product_id=${productId}`
		);
	};
}

export default ProductService;
