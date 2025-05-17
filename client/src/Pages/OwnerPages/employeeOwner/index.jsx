import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmPopup from "../../../Components/ConfirmPopup/index.jsx";
import { showToast } from "../../../Components/Toast/index.jsx";
import StaffService from "../../../Services/staff";

const FormControl = React.lazy(() =>
  import("../../../Components/FormControl/index.jsx")
);
const Loading = React.lazy(() =>
  import("../../../Components/Loading/index.jsx")
);
const Form = React.lazy(() => import("./Form/index.jsx"));

const SubHeader = ({ selectedRows, handleDeleteMultiple }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (selectedRows.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full p-5 bg-gray-100 flex items-center justify-between">
        <span>{selectedRows.length} mục được chọn</span>
        <button onClick={() => setShowConfirmDelete(true)}>
          <IoTrashOutline
            size={36}
            className="cursor-pointer rounded-full bg-red-100 hover:bg-red-200 text-red-500 p-2"
          />
        </button>
      </div>

      <ConfirmPopup
        toggle={showConfirmDelete}
        setToggle={() => setShowConfirmDelete(false)}
        onOk={handleDeleteMultiple}
        onCancel={() => setShowConfirmDelete(false)}
        title="Bạn có chắc chắn muốn xóa không?"
        message="Hành động này không thể hoàn tác"
        okButtonText="OK"
        cancelButtonText="Hủy"
      />
    </>
  );
};

const SelectBox = React.forwardRef(({ ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      {...props}
      className="w-4 h-4 text-[#435d63] bg-[#435d63] border-gray-200 rounded focus:ring-[#435d63]"
    />
  );
});

const StaffOwner = () => {
  const columns = [
    {
      name: "Tên Nhân viên",
      selector: (row) => row.staff?.name,
      sortable: true,
    },
    {
      name: "Tên Cửa hàng",
      selector: (row) => row.store?.name,
      sortable: true,
    },
    {
      name: "Tên Dịch Vụ",
      selector: (row) => row.service?.name,
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Actions",
      center: true,
      cell: (row) => (
        <div className="flex gap-2">
          <FaRegEdit
            className="cursor-pointer"
            size={18}
            onClick={() => handleEdit(row)}
          />
          <IoTrashOutline
            className="cursor-pointer"
            size={18}
            onClick={() => handleDeleteSingle(row.id)}
          />
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const [searchInput, setSearchInput] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStaff, setEditStaff] = useState(null);
  const [showConfirmDeleteSingle, setShowConfirmDeleteSingle] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        setLoading(true);
        const response = await StaffService.getAllStaffs();
        console.log(response.data);
        setStaffData(response.data);
      } catch (error) {
        showToast("Lỗi khi tải danh sách nhân viên", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, []);

  const handleFieldsChange = (key, value) => {
    setSearchInput(value);
  };

  const handleRowsSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const handleDeleteMultiple = async () => {
    const ids = selectedRows.map((row) => row.id);
    try {
      await StaffService.deleteMultipleStaffs(ids);
      setStaffData(
        staffData.filter((staff) => !ids.includes(staff.id))
      );
      setSelectedRows([]);
      showToast("Xóa nhiều thành công", "success");
    } catch (error) {
      console.error("Lỗi khi xóa nhiều:", error);
      showToast("Lỗi khi xóa nhiều", "error");
    }
  };

  const handleDeleteSingle = (staffId) => {
    setStaffIdToDelete(staffId);
    setShowConfirmDeleteSingle(true);
  };

  const confirmDeleteSingle = async () => {
    try {
      await StaffService.deleteStaff(staffIdToDelete);
      setStaffData(
        staffData.filter((staff) => staff.id !== staffIdToDelete)
      );
      setShowConfirmDeleteSingle(false);
      showToast("Xóa thành công", "success");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      showToast("Lỗi khi xóa", "error");
    }
  };

  const handleEdit = (staff) => {
    setEditStaff(staff);
    setShowForm(true);
  };

  const handleRowClick = (row) => {
  setEditStaff(row);
  setShowForm(true);
  setViewOnly(true); 
};

  const handleFormSubmit = async (newStaffData) => {
  try {
    if (editStaff) {
      await StaffService.updateStaff(editStaff.id, newStaffData);
     
      const response = await StaffService.getAllStaffs();
      setStaffData(response.data);
      showToast("Cập nhật thành công", "success");
    } else {
      await StaffService.createStaff(newStaffData);
      const response = await StaffService.getAllStaffs();
      setStaffData(response.data);
      showToast("Tạo thành công", "success");
    }
    setShowForm(false);
    setEditStaff(null);
  } catch (error) {
    showToast("Lỗi khi tạo nhân viên", "error");
  }
};

  const filteredData = staffData.filter((staff) =>
  staff.staff?.name.toLowerCase().includes(searchInput.toLowerCase())
);

  return (
    <>
      <section>
        <div>
          <header className="bg-white rounded-md p-4 flex items-center justify-between shadow-md">
            <div className="min-w-fit max-w-md">
              <FormControl
                type="text"
                placeHolder="Tìm kiếm nhân viên..."
                wrapInputStyle="!border-black/10 rounded-md focus-within:!border-[#435d63] transition-all"
                inputStyle="font-serif placeholder:text-lg text-black placeholder:font-serif !p-4 !py-2"
                id="search"
                onChange={(event) =>
                  handleFieldsChange("search", event.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="text-sm rounded-md w-fit transition-all duration-700 hover:bg-black text-white bg-[#435d63] p-2 font-serif font-semibold"
              onClick={() => {
                setEditStaff(null);
                setShowForm(true);
              }}
            >
              Tạo mới
            </button>
          </header>

          <main className="mt-4 rounded-md shadow-md overflow-hidden">
            {loading ? (
              <Loading />
            ) : (
              <DataTable
                pointerOnHover
                highlightOnHover
                selectableRows
                striped
                pagination
                onSelectedRowsChange={handleRowsSelected}
                onRowClicked={handleRowClick}
                subHeader={selectedRows.length > 0}
                subHeaderComponent={
                  <SubHeader
                    selectedRows={selectedRows}
                    handleDeleteMultiple={handleDeleteMultiple}
                  />
                }
                columns={columns}
                data={filteredData}
                selectableRowsComponent={SelectBox}
              />
            )}
          </main>
        </div>
      </section>

      <Form
        toggle={showForm}
        setToggle={() => {
          setShowForm(false);
          setEditStaff(null);
          setViewOnly(false);
        }}
        initialData={editStaff}
        onSubmit={handleFormSubmit}
        isDisabled={viewOnly}
      />

      <ConfirmPopup
        toggle={showConfirmDeleteSingle}
        setToggle={() => setShowConfirmDeleteSingle(false)}
        onOk={confirmDeleteSingle}
        onCancel={() => setShowConfirmDeleteSingle(false)}
        title="Bạn có chắc chắn muốn xóa nhân viên này không?"
        message="Hành động này không thể hoàn tác"
        okButtonText="OK"
        cancelButtonText="Hủy"
      />
    </>
  );
};

export default StaffOwner;