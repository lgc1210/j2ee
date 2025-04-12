import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

const StoreOwner = () => {
  const [storeData, setStoreData] = useState([]); // State để lưu dữ liệu store
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get("http://localhost:8080/owner/store", {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm Authorization header
          },
        });
        setStoreData(response.data); // Cập nhật dữ liệu vào state
      } catch (error) {
        console.error("Error fetching store data:", error); // Xử lý lỗi nếu có
      } finally {
        setLoading(false); // Đặt trạng thái loading thành false sau khi hoàn tất
      }
    };
  
    fetchStoreData(); // Gọi hàm để lấy dữ liệu khi component được mount
  }, []);

  const columns = [
    {
      name: "Tên cửa hàng",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Địa chỉ",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Chủ sở hữu",
      selector: (row) => row.ownerName,
      sortable: true,
    },
  ];

  return (
    <div>
      <h1>Thông tin cửa hàng</h1>
      <DataTable
        columns={columns}
        data={storeData}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default StoreOwner;