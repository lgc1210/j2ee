import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class RoleService {
  // Lấy tất cả roles
  getAllRoles = async () => {
    return await apiInstance.get(`${baseURL}/roles`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Lấy role theo ID
  getRoleById = async (roleId) => {
    return await apiInstance.get(`${baseURL}/roles/${roleId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Tạo role mới
  createRole = async (payload) => {
    return await apiInstance.post(`${baseURL}/roles`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Cập nhật role
  updateRole = async (roleId, payload) => {
    return await apiInstance.put(`${baseURL}/roles/${roleId}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Xóa một role
  deleteRole = async (roleId) => {
    return await apiInstance.delete(`${baseURL}/roles/${roleId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Xóa nhiều roles
  deleteMultipleRoles = async (roleIds) => {
    return await apiInstance.delete(`${baseURL}/roles/delete-multiple`, {
      data: roleIds, 
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
}

export default new RoleService();