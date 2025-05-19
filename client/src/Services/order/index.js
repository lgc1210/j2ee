import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class OrderService {
    getOrderStats = async (timeFilter, specificFilter) => {
        return await apiInstance.get(
            `${baseURL}/order/filter_orders?filter=${timeFilter}${specificFilter ? `&specificFilter=${specificFilter}` : ''}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    };

    getOrdersByStore = async (storeId) => {
        return await apiInstance.get(
            `${baseURL}/orders/store/${storeId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
    }

    updateOrderStatus = async (orderId, status) => {
        return await apiInstance.put(
            `${baseURL}/orders/${orderId}?status=${status}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
    }
}

export default new OrderService();