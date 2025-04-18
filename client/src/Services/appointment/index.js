import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class AppointmentService {
  // Get appointment statistics 
  getAppointmentStats = async (timeFilter, specificFilter) => {
      return await apiInstance.get(
          `${baseURL}/appointment/filter_appointments?filter=${timeFilter}${specificFilter ? `&specificFilter=${specificFilter}` : ''}`,
          {
              headers: {
                  "Content-Type": "application/json",
              },
          }
      );
  };
  getAppointmentServices = async (timeFilter, specificFilter) => {
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
getBusiestDays = async (year, week) => {
  return await apiInstance.get(
    `${baseURL}/appointment/busiest-days`,
    {
      params: { year, week },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// Lấy số lượng lịch hẹn theo khung giờ trong tuần
getPopularTimeSlots = async (year, week) => {
  return await apiInstance.get(
    `${baseURL}/appointment/popular-time-slots`,
    {
      params: { year, week },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};




}






export default new AppointmentService();