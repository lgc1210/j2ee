import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class CartService {
	static addToCart = async ({ userId, productId, quantity }) => {
		return apiInstance.post(`${baseURL}/carts`, {
			userId,
			productId,
			quantity,
		});
	};

	static deleteFromCart = async (cartId, productId) => {
		return apiInstance.delete(
			`${baseURL}/carts?cart_id=${cartId}&product_id=${productId}`
		);
	};

	static getCartByCustomerId = async (customerId) => {
		return apiInstance.get(
			`${baseURL}/carts/customers?customer_id=${customerId}`
		);
	};
}

export default CartService;
