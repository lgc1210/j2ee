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

	// Get appointment statistics
	static getAppointmentStats = async (timeFilter, specificFilter) => {
		return await apiInstance.get(
			`${baseURL}/appointment/filter_appointments?filter=${timeFilter}${
				specificFilter ? `&specificFilter=${specificFilter}` : ""
			}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	};
	static getAppointmentServices = async (timeFilter, specificFilter) => {
		return await apiInstance.get(
			`${baseURL}/appointment/service-category-stats`,
			{
				params: { timeFilter, specificFilter },
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	};

	// Lấy số lượng lịch hẹn theo ngày trong tuần
	static getBusiestDays = async (year, week) => {
		return await apiInstance.get(`${baseURL}/appointment/busiest-days`, {
			params: { year, week },
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	// Lấy số lượng lịch hẹn theo khung giờ trong tuần
	static getPopularTimeSlots = async (year, week) => {
		return await apiInstance.get(`${baseURL}/appointment/popular-time-slots`, {
			params: { year, week },
			headers: {
				"Content-Type": "application/json",
			},
		});
	};
}

export default AppointmentService;
