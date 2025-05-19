import React, { useState, useEffect, lazy } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmPopup from "../../../Components/ConfirmPopup";
import { showToast } from "../../../Components/Toast";
import DiscountService from "../../../Services/discount";

const FormControl = lazy(() => import("../../../Components/FormControl"));
const Loading = lazy(() => import("../../../Components/Loading"));
const Form = lazy(() => import("./Form")); 

const SubHeader = ({ selectedRows, handleDeleteMultiple }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  if (selectedRows.length === 0) return null;
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
        message="Hành động này có thể được hoàn tác"
        okButtonText="OK"
        cancelButtonText="Hủy"
      />
    </>
  );
};

const SelectBox = React.forwardRef((props, ref) => (
  <input
    ref={ref}
    type="checkbox"
    {...props}
    className="w-4 h-4 text-[#435d63] bg-[#435d63] border-gray-200 rounded focus:ring-[#435d63]"
  />
));

const DiscountOwner = () => {
  const columns = [
    {
      name: "Mã giảm giá",
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: "Mô tả",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Giá trị (%)",
      selector: (row) => row.value,
      sortable: true,
    },
    {
      name: "Tên Store",
      selector: (row) => row.store?.name,
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
  const [discountData, setDiscountData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDiscount, setEditDiscount] = useState(null);
  const [showConfirmDeleteSingle, setShowConfirmDeleteSingle] = useState(false);
  const [discountIdToDelete, setDiscountIdToDelete] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        const response = await DiscountService.getAll();
        setDiscountData(response.data);
      } catch (error) {
        showToast("Lỗi khi tải danh sách", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
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
      await DiscountService.deleteMultipleDiscounts(ids);
      setDiscountData(discountData.filter((discount) => !ids.includes(discount.id)));
      setSelectedRows([]);
      showToast("Xóa nhiều thành công", "success");
    } catch (error) {
      showToast("Lỗi khi xóa nhiều", "error");
    }
  };

  const handleDeleteSingle = (id) => {
    setDiscountIdToDelete(id);
    setShowConfirmDeleteSingle(true);
  };

  const confirmDeleteSingle = async () => {
    try {
      await DiscountService.deleteDiscount(discountIdToDelete);
      setDiscountData(discountData.filter((d) => d.id !== discountIdToDelete));
      setShowConfirmDeleteSingle(false);
      showToast("Xóa thành công", "success");
    } catch (error) {
      showToast("Lỗi khi xóa", "error");
    }
  };

  const handleEdit = (discount) => {
    setEditDiscount(discount);
    setShowForm(true);
  };

  const handleFormSubmit = async (newDiscountData) => {
    try {
      if (editDiscount) {
        const response = await DiscountService.updateDiscount(editDiscount.id, newDiscountData);
        setDiscountData(
          discountData.map((discount) =>
            discount.id === editDiscount.id ? response.data : discount
          )
        );
        showToast("Cập nhật thành công", "success");
      } else {
        const response = await DiscountService.createDiscount(newDiscountData);
        setDiscountData([...discountData, response.data]);
        showToast("Tạo thành công", "success");
      }
      setShowForm(false);
      setEditDiscount(null);
    } catch (error) {
      showToast("Lỗi khi lưu", "error");
    }
  };

  const handleRowClicked = (row) => {
    setSelectedRow(row);
  };

  const filteredData = discountData.filter((discount) =>
    discount.code.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <section>
        <div>
          <header className="bg-white rounded-md p-4 flex items-center justify-between shadow-md">
            <div className="min-w-fit max-w-md">
              <FormControl
                type="text"
                placeHolder="Tìm kiếm mã giảm giá..."
                wrapInputStyle="!border-black/10 rounded-md focus-within:!border-[#435d63] transition-all"
                inputStyle="font-serif placeholder:text-lg text-black placeholder:font-serif !p-4 !py-2"
                id="search"
                onChange={(event) =>
                  handleFieldsChange("search", event.target.value)
                }
                Icon={CiSearch}
                iconSize={24}
                iconStyle="transition-all text-[#435d63] hover:text-black mx-4"
              />
            </div>
            <button
              type="button"
              className="text-sm rounded-md w-fit transition-all duration-700 hover:bg-black text-white bg-[#435d63] p-2 font-serif font-semibold"
              onClick={() => {
                setEditDiscount(null);
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
                onRowClicked={handleRowClicked}
              />
            )}
          </main>
        </div>
      </section>

      {/* Form thêm/sửa */}
      <Form
        toggle={showForm}
        setToggle={() => {
          setShowForm(false);
          setEditDiscount(null);
        }}
        initialData={editDiscount}
        onSubmit={handleFormSubmit}
        isDisabled={false}
      />

      {/* Form xem chi tiết */}
      <Form
        toggle={!!selectedRow}
        setToggle={() => setSelectedRow(null)}
        initialData={selectedRow}
        onSubmit={() => {}}
        isDisabled={true}
      />

      <ConfirmPopup
        toggle={showConfirmDeleteSingle}
        setToggle={() => setShowConfirmDeleteSingle(false)}
        onOk={confirmDeleteSingle}
        onCancel={() => setShowConfirmDeleteSingle(false)}
        title="Bạn có chắc chắn muốn xóa mã giảm giá này không?"
        message="Hành động này có thể được hoàn tác"
        okButtonText="OK"
        cancelButtonText="Hủy"
      />
    </>
  );
};

export default DiscountOwner;