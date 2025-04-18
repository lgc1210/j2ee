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
}

export default new OrderService();