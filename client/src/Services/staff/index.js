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
}

export default StaffService;