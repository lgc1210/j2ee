import React, { createContext, useContext, useCallback, useState } from "react";
import ProfileService from "../../Services/profile";
import { useAuth } from "../Auth";
import { showToast } from "../../Components/Toast";

const ProfileContext = createContext();

const Profile = ({ children }) => {
	const [historyAppointmentList, setHistoryAppointmentList] = useState([]);
	const [loadingHistoryAppointmentList, setLoadingHistoryAppointmentList] =
		useState(false);
	const { user, isAuthenticated } = useAuth();

	const fetchHistoryAppointmentList = useCallback(async () => {
		try {
			if (!isAuthenticated && user == null) {
				showToast("Unauthenticated", "error");
				return;
			}

			setLoadingHistoryAppointmentList(true);

			const response = await ProfileService.getAllCustomerAppointment(user?.id);
			console.log("History appointments: ", response);
			if (response.status === 200) {
				setHistoryAppointmentList(response.data?.appointments || []);
			}
		} catch (error) {
			console.log("Error occurs", error);
		} finally {
			setLoadingHistoryAppointmentList(false);
		}
	}, [isAuthenticated, user]);

	return (
		<ProfileContext.Provider
			value={{
				historyAppointmentList,
				loadingHistoryAppointmentList,
				fetchHistoryAppointmentList,
			}}>
			{children}
		</ProfileContext.Provider>
	);
};

export const useProfile = () => useContext(ProfileContext);

export default Profile;
