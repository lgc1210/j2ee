import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Auth";
import CartService from "../../Services/cart";
import { showToast } from "../../Components/Toast";

const CartContext = React.createContext();

const Cart = ({ children }) => {
	const [cart, setCart] = React.useState([]);
	const [loadingFetchingCart, setLoadingFetchingCart] = useState(false);
	const [pending, setPending] = React.useState(false);
	const { user, isAuthenticated } = useAuth();

	const fetchCart = useCallback(async () => {
		try {
			setLoadingFetchingCart(true);
			const response = await CartService.getCartByCustomerId(user?.id);
			if (response.status === 200) {
				setCart(response.data || []);
			}
		} catch (error) {
			console.log("Error occurs while fetching cart", error);
		} finally {
			setLoadingFetchingCart(false);
		}
	}, [user?.id]);

	useEffect(() => {
		if (isAuthenticated) {
			fetchCart();
		}
	}, [isAuthenticated, fetchCart]);

	const handleChangeQuantity = async (productId, quantity) => {
		try {
			setPending(true);
			const response = await CartService.addToCart({
				userId: user?.id,
				productId,
				quantity,
			});
			if (response.status === 200) {
				console.log("Cart response:", response);
				showToast("Added successfully");
				await fetchCart();
			}
		} catch (error) {
			console.log("Errors occur while changing product's quantity");
			showToast("Add failed", "error");
		} finally {
			setPending(false);
		}
	};

	const handleDeleteFromCart = async (productId) => {
		try {
			setPending(true);
			const response = await CartService.deleteFromCart(cart?.id, productId);
			if (response.status === 200) {
				showToast("Removed successfully");
				await fetchCart();
			}
		} catch (error) {
			console.log("Errors occur while removing from cart", error);
			showToast("Removed failed", "error");
		} finally {
			setPending(false);
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				pending,
				loadingFetchingCart,
				handleChangeQuantity,
				handleDeleteFromCart,
			}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => React.useContext(CartContext);

export default Cart;
