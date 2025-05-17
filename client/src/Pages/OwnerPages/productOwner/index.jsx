import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmPopup from "../../../Components/ConfirmPopup/index.jsx";
import { showToast } from "../../../Components/Toast/index.jsx";
import ProductService from "../../../Services/product";

const FormControl = React.lazy(() =>
  import("../../../Components/FormControl/index.jsx")
);
const Loading = React.lazy(() =>
  import("../../../Components/Loading/index.jsx")
);
const Form = React.lazy(() => import("./Form/index.jsx"));

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

const ProductOwner = () => {
  const columns = [
    {
      name: "Ảnh",
      selector: (row) => row.image,
      cell: (row) =>
        row.image ? (
          <img
            src={
              row.image.startsWith("http")
                ? row.image
                : `http://localhost:8080/uploads/${row.image}`
            }
            alt={row.name}
           className="w-[150px] h-[150px] p-1 rounded-lg object-cover"
          />
        ) : (
          <span className="text-gray-400 italic">Không có ảnh</span>
        ),
      width: "120px",
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: "Tên sản phẩm",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mô tả",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Khối lượng",
      selector: (row) => row.weight,
      sortable: true,
    },
    {
      name: "Giá cũ",
      selector: (row) => row.old_price,
      sortable: true,
    },
    {
      name: "Giá",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Trạng thái",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Tồn kho",
      selector: (row) => row.stock_quantity,
      sortable: true,
    },
    {
      name: "Danh mục",
      selector: (row) => row.category?.name,
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
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [showConfirmDeleteSingle, setShowConfirmDeleteSingle] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getAllbyStoreId();
        setProductData(response.data);
      } catch (error) {
        showToast("Lỗi khi tải danh sách", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
      await ProductService.deleteMultipleProducts(ids);
      setProductData(
        productData.filter((product) => !ids.includes(product.id))
      );
      setSelectedRows([]);
      showToast("Xóa nhiều thành công", "success");
    } catch (error) {
      showToast("Lỗi khi xóa nhiều", "error");
    }
  };

  const handleDeleteSingle = (id) => {
    setProductIdToDelete(id);
    setShowConfirmDeleteSingle(true);
  };

  const confirmDeleteSingle = async () => {
    try {
      await ProductService.deleteProduct(productIdToDelete);
      setProductData(productData.filter((p) => p.id !== productIdToDelete));
      setShowConfirmDeleteSingle(false);
      showToast("Xóa thành công", "success");
    } catch (error) {
      showToast("Lỗi khi xóa", "error");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (newProductData) => {
    try {
      if (editProduct) {
        const response = await ProductService.updateProduct(
          editProduct.id,
          newProductData
        );
        setProductData(
          productData.map((product) =>
            product.id === editProduct.id ? response.data : product
          )
        );
        showToast("Cập nhật thành công", "success");
      } else {
        const response = await ProductService.createProduct(newProductData);
        setProductData([...productData, response.data]);
        showToast("Tạo thành công", "success");
      }
      setShowForm(false);
      setEditProduct(null);
    } catch (error) {
      showToast("Lỗi khi lưu", "error");
    }
  };

  const handleRowClicked = (row) => {
    setSelectedRow(row);
  };

  const filteredData = productData.filter((product) =>
    product.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <section>
        <div>
          <header className="bg-white rounded-md p-4 flex items-center justify-between shadow-md">
            <div className="min-w-fit max-w-md">
              <FormControl
                type="text"
                placeHolder="Tìm kiếm sản phẩm..."
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
                setEditProduct(null);
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
          setEditProduct(null);
        }}
        initialData={editProduct}
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
        title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
        message="Hành động này có thể được hoàn tác"
        okButtonText="OK"
        cancelButtonText="Hủy"
      />
    </>
  );
};

export default ProductOwner;
