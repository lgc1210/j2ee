import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Auth";
import {useStore}  from "../Store";
import CartService from "../../Services/cart";
import OrderService from "../../Services/order";
import StoreService from "../../Services/store";
import { showToast } from "../../Components/Toast";

const OrderContext = React.createContext();

const Order = ({ children }) => {
	const [order, setOrder] = useState(null);
    const [currentStoreOrders, setCurrentStoreOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user, isAuthenticated } = useAuth();
    const {currentStore} = useStore();

	useEffect(() => {
		if (isAuthenticated && user && user?.role.name === "owner") {
			fetchOrdersByCurrentStore();
		}
	}, [isAuthenticated]);

    const fetchOrdersByCurrentStore = async() => {
        if (!user?.id || !currentStore) {
			setCurrentStoreOrders([]);
			return;
		}

        try {
			setLoading(true);
			const response = await OrderService.getOrdersByStore(currentStore?.id);
            
			if (response.status === 200) {
				setCurrentStoreOrders(response.data);
                console.log("Current store orders:", response.data);
			} else {
				setCurrentStoreOrders([]);
			}
		} catch (error) {
            showToast("Error fetching current store orders.", "error");
			console.error("Error fetching current store orders:", error);
			setCurrentStoreOrders([]);
		} finally {
			setLoading(false);
		}
    }

    const updateOrderStatus = async(orderId, status) => {
        try {
			setLoading(true);
			const response = await OrderService.updateOrderStatus(orderId, status);
            
			if (response.status === 200) {
                console.log("Order status updated:", response.data);
                if(currentStoreOrders) {
                    await fetchOrdersByCurrentStore();
                }
			}
            return response;
		} catch (error) {
            showToast("Error updating order status.", "error");
			console.error("Error updating order status:", error);
		} finally {
			setLoading(false);
		}
    }

	return (
		<OrderContext.Provider
			value={{
                order,
                currentStoreOrders,
                loading,
                fetchOrdersByCurrentStore
			}}>
			{children}
		</OrderContext.Provider>
	);
};

export const useOrder = () => React.useContext(OrderContext);

export default Order;
