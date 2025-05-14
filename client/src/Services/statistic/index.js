import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class Statistics {

  getStoreAppointmentStats = async (timeFilter, specificFilter) => {
    return await apiInstance.get(`${baseURL}/statistics/stores/appointments`, {
      params: { timeFilter, specificFilter },
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  getStoreRevenueStats = async (timeFilter, specificFilter) => {
    return await apiInstance.get(`${baseURL}/statistics/stores/revenue`, {
      params: { timeFilter, specificFilter },
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  getCustomerAppointmentStats = async (timeFilter, specificFilter) => {
    return await apiInstance.get(`${baseURL}/statistics/customers/appointments`, {
      params: { timeFilter, specificFilter },
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  getStaffAppointmentStats = async (timeFilter, specificFilter) => {
    return await apiInstance.get(`${baseURL}/statistics/staff/appointments`, {
      params: { timeFilter, specificFilter },
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
}

export default new Statistics();
