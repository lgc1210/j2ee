import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class AppointmentService {
	// Fetch available time slots for a date, store, and service
	static getAvailableTimeSlots = async (
		storeId = 101,
		serviceId = 1,
		appointmentDate = "2025-04-20"
	) => {
		return await apiInstance.get(
			`${baseURL}/availability/time-slots?service_id=${serviceId}&store_id=${storeId}&appointment_date=${appointmentDate}`
		);
	};

	// Fetch available staff for a specific time slot, date, store, and service
	static getAvailableStaff = async (
		storeId,
		serviceId,
		appointmentDate,
		startTime,
		endTime
	) => {
		return await apiInstance.get(
			`${baseURL}/availability/staff?service_id=${serviceId}&store_id=${storeId}&appointment_date=${appointmentDate}&start_time=${startTime}&end_time=${endTime}`
		);
	};

	static create = async (appointmentData) => {
		return await apiInstance.post(`${baseURL}/appointments`, appointmentData);
	};
}

export default AppointmentService;
