import apiInstance from "../../Config/api";

const baseURL = process.env.REACT_APP_API;

class ServiceService {
	 // Lấy danh sách tất cả dịch vụ
	 static getAllServices = async () => {
		return await apiInstance.get(`${baseURL}/services/ListServices`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	static getAllCategoriesOfService = async () => {
		return await apiInstance.get(`${baseURL}/categoryOfServices`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	// Tạo sản phẩm
	static createService = async (payload) => {
        try {
            return await apiInstance.post(`${baseURL}/services`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            if (error.response?.status === 409) {
                throw new Error(
                    "Sản phẩm đã tồn tại. Vui lòng thử lại."
                );
            }
            throw error.response?.data || error.message;
        }
    };

	 // Cập nhật sản phẩm
	 static updateService = async (serviceId, payload) => {
        return await apiInstance.put(`${baseURL}/services/${serviceId}`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    // Xóa sản phẩm
    static deleteService = async (serviceId) => {
        return await apiInstance.delete(`${baseURL}/services/${serviceId}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    // Xóa nhiều sản phẩm
    static deleteMultipleServices = async (serviceIds) => {
        return await apiInstance.delete(`${baseURL}/services`, {
            data: serviceIds,
            headers: {
                "Content-Type": "application/json",
            },
        });
    };
	
	  

}

export default ServiceService;
