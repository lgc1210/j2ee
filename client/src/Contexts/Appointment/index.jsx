import React, { useEffect, useState } from "react";
import AppointmentService from "../../Services/appointment";
import { useStore } from "../Store";
import { showToast } from "../../Components/Toast";
import { useAuth } from "../Auth";

const AppointmentContext = React.createContext();

const Appointment = ({ children }) => {
    const [currentStoreAppointments, setCurrentStoreAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentStore } = useStore();
    const { user } = useAuth();

    const fetchCurrentStoreAppointments = async () => {
        try {
            setLoading(true);
            const response = await AppointmentService.getByStoreId(currentStore?.id);
            if (response.status === 200) {
                setCurrentStoreAppointments(response?.data);
            }
            console.log("Current store appointment response:", response);
            return response;
        } catch (error) {
            showToast("There's something wrong while fetching current store appointments", "error");
            console.log("There's something wrong while fetching current store appointments", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (user && user?.role.name === "owner" && currentStore) {
                await fetchCurrentStoreAppointments();
            }
        };
        fetchData();
    }, [user, currentStore])

	return (
		<AppointmentContext.Provider
			value={{
                currentStoreAppointments,
                loading,
                setLoading,
                fetchCurrentStoreAppointments
			}}>
			{children}
		</AppointmentContext.Provider>
	);
};

export const useAppointment = () => React.useContext(AppointmentContext);

export default Appointment;
