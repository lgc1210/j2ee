import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class StaffService {
  // Lấy danh sách tất cả nhân viên
  static getAllStaffs = async () => {
    return await apiInstance.get(`${baseURL}/staff/ListStaff`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Lấy danh sách nhân viên theo ID
  static getStaffById = async (staffId) => {
    return await apiInstance.get(`${baseURL}/staffs/${staffId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

 

  static createStaff = async (payload) => {
    return await apiInstance.post(`${baseURL}/staff/createWithUser`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Cập nhật nhân viên
  static updateStaff = async (staffId, payload) => {
    return await apiInstance.put(`${baseURL}/staff/${staffId}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Xóa nhân viên
  static deleteStaff = async (staffId) => {
    return await apiInstance.delete(`${baseURL}/staff/${staffId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Xóa nhiều nhân viên
  static deleteMultipleStaffs = async (staffIds) => {
    return await apiInstance.delete(`${baseURL}/staff`, {
      data: staffIds,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
}

export default StaffService;
