import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Auth";
import CartService from "../../Services/cart";
import { showToast } from "../../Components/Toast";

const CartContext = React.createContext();

const Cart = ({ children }) => {
	const [cart, setCart] = React.useState([]);
	const [cartId, setCartId] = React.useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const [loadingFetchingCart, setLoadingFetchingCart] = useState(false);
	const [pending, setPending] = React.useState(false);
	const { user, isAuthenticated } = useAuth();

	const fetchCart = useCallback(async () => {
		if (!user?.id) {
			setCart([]);
			return;
		}

		try {
			setLoadingFetchingCart(true);
			const response = await CartService.getCartByCustomerId(user.id);
			if (response.status === 200 && Array.isArray(response.data?.items)) {
				let total = 0;
				const data = response.data.items.map((item) => {
					const productTotalPrice =
						(item?.product?.price ?? 0) * (item?.quantity ?? 0);
					total += productTotalPrice;
					return {
						...item,
						productTotalPrice,
					};
				});
				setTotalPrice(total);
				setCart(data);
				setCartId(response?.data?.id);
			} else {
				setCart([]);
			}
		} catch (error) {
			console.error("Error fetching cart:", error);
			setCart([]);
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
			const response = await CartService.deleteFromCart(cartId, productId);
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
				totalPrice,
				handleChangeQuantity,
				handleDeleteFromCart,
			}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => React.useContext(CartContext);

export default Cart;
