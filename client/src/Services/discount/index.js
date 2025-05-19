import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class DiscountService {
    // Lấy tất cả discount
    static getAll = async () => {
        return await apiInstance.get(`${baseURL}/discounts/ListDiscounts`,{
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    static createDiscount = async (data) => {
        return await apiInstance.post(`${baseURL}/discounts`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    };  

    static updateDiscount = async (id, data) => {
        return await apiInstance.put(`${baseURL}/discounts/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    static deleteDiscount = async (id) => {
        return await apiInstance.delete(`${baseURL}/discounts/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

     static deleteMultipleDiscounts = async (Ids) => {
        return await apiInstance.delete(`${baseURL}/discounts`, {
            data: Ids,
            headers: {
                "Content-Type": "application/json",
            },
        });
    };
    
}

export default DiscountService;