import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class PaymentService {
    getPaymentsByStore = async (storeId) => {
        return await apiInstance.get(
            `${baseURL}/payments/store/${storeId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            })
    }
}

export default PaymentService;