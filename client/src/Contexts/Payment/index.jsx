import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Auth";
import {useStore}  from "../Store";
import CartService from "../../Services/cart";
import PaymentService from "../../Services/payment";
import StoreService from "../../Services/store";
import { showToast } from "../../Components/Toast";

const PaymentContext = React.createContext();

const Payment = ({ children }) => {
    const [payment, setPayment] = useState(null);
    const [currentStorePayments, setCurrentStorePayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const {currentStore} = useStore();

    useEffect(() => {
        if (isAuthenticated && user && user?.role.name === "owner") {
            fetchPaymentsByCurrentStore();
        }
    }, [isAuthenticated]);

    const fetchPaymentsByCurrentStore = async() => {
        if (!user?.id || !currentStore) {
            setCurrentStorePayments([]);
            return;
        }

        try {
            setLoading(true);
            const response = await PaymentService.getPaymentsByStore(currentStore?.id);
            
            if (response.status === 200) {
                setCurrentStorePayments(response.data);
                console.log("Current store payments:", response.data);
            } else {
                setCurrentStorePayments([]);
            }
        } catch (error) {
            showToast("Error fetching current store payments.", "error");
            console.error("Error fetching current store payments:", error);
            setCurrentStorePayments([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <PaymentContext.Provider
            value={{
                payment,
                currentStorePayments,
                loading,
                fetchPaymentsByCurrentStore
            }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => React.useContext(PaymentContext);

export default Payment;
