import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmPopup from "../../Components/ConfirmPopup/index.jsx";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../../Components/Toast/index.jsx";
import CategoryOfServiceService from "../../Services/categoryOfService";
import * as XLSX from "xlsx";
const FormControl = React.lazy(() =>
	import("../../Components/FormControl/index.jsx")
);
const Loading = React.lazy(() => import("../../Components/Loading/index.jsx"));
const Form = React.lazy(() => import("./Form/index.jsx"));

const SubHeader = ({ selectedRows, handleDeleteMultiple }) => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	if (selectedRows.length === 0) return null;

	return (
		<>
			<div className='w-full p-5 bg-gray-100 flex items-center justify-between'>
				<span>{selectedRows.length} mục được chọn</span>
				<button onClick={() => setShowConfirmDelete(true)}>
					<IoTrashOutline
						size={36}
						className='cursor-pointer rounded-full bg-red-100 hover:bg-red-200 text-red-500 p-2'
					/>
				</button>
			</div>

			<ConfirmPopup
				toggle={showConfirmDelete}
				setToggle={() => setShowConfirmDelete(false)}
				onOk={handleDeleteMultiple}
				onCancel={() => setShowConfirmDelete(false)}
				title='Are you sure you want to delete this?'
				message='This action can be undone'
				okButtonText='OK'
				cancelButtonText='Cancel'
			/>
		</>
	);
};

const SelectBox = React.forwardRef(({ ...props }) => {
	return (
		<input
			type='checkbox'
			{...props}
			className='w-4 h-4 text-[#435d63] bg-[#435d63] border-gray-200 rounded focus:ring-[#435d63]'
		/>
	);
});

const Categories = () => {
	const columns = [
		{
			name: "Image",
			sortable: true,
			cell: (row) => (
				<img
					src={`/assets/images/categoryOfService/${row.image}`}
					alt='Category'
					style={{ width: "50px", height: "50px", objectFit: "cover" }}
				/>
			),
		},
		{
			name: "Name",
			sortable: true,
			selector: (row) => row.name,
		},
		{
			name: "Status",
			sortable: true,
			selector: (row) => (row.status === "1" ? "Active" : "Inactive"),
		},
		{
			name: "Actions",
			center: true,
			cell: (row) => (
				<div className='flex gap-2'>
					<FaRegEdit
						className='cursor-pointer'
						size={18}
						onClick={() => handleEdit(row)}
					/>
					<IoTrashOutline
						className='cursor-pointer'
						size={18}
						onClick={() => handleDeleteSingle(row.id)}
					/>
				</div>
			),
			ignoreRowClick: true,
		},
	];

	const [searchInput, setSearchInput] = useState("");
	const [errors, setErrors] = useState("");
	const [showActions, setShowActions] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [categoryOSsData, setCategoryOSsData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editCategoryOS, setEditCategoryOS] = useState(null);
	const [showConfirmDeleteSingle, setShowConfirmDeleteSingle] = useState(false);
	const [categoryOSIdToDelete, setCategoryOSIdToDelete] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				setLoading(true);
				const response =
					await CategoryOfServiceService.getAllCategoryOfServices();
				setCategoryOSsData(response.data);
				setFilteredData(response.data);
			} catch (error) {
				showToast("Lỗi khi tải danh sách", "error");
			} finally {
				setLoading(false);
			}
		};
		fetchRoles();
	}, []);

	// Lọc dữ liệu khi searchInput thay đổi
	useEffect(() => {
		const filtered = categoryOSsData.filter((item) =>
			item.name.toLowerCase().includes(searchInput.toLowerCase())
		);
		setFilteredData(filtered);
	}, [searchInput, categoryOSsData]);

	const handleFieldsChange = (key, value) => {
		setSearchInput(value);
	};

	const handleRowsSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
	};

	const handleDeleteMultiple = async () => {
		const ids = selectedRows.map((row) => row.id);
		try {
			await CategoryOfServiceService.deleteMultipleCategoryOfServices(ids);
			setCategoryOSsData(
				categoryOSsData.filter((role) => !ids.includes(role.id))
			);
			setSelectedRows([]);
			showToast("Xóa nhiều thành công", "success");
		} catch (error) {
			console.error("Lỗi khi xóa nhiều:", error);
			showToast("Lỗi khi xóa nhiều", "error");
		}
	};

	const handleDeleteSingle = (categoryOSId) => {
		setCategoryOSIdToDelete(categoryOSId);
		setShowConfirmDeleteSingle(true);
	};

	const confirmDeleteSingle = async () => {
		try {
			await CategoryOfServiceService.deleteCategoryOfService(
				categoryOSIdToDelete
			);
			setCategoryOSsData(
				categoryOSsData.filter(
					(categoryOS) => categoryOS.id !== categoryOSIdToDelete
				)
			);
			setShowConfirmDeleteSingle(false);
			showToast("Xóa thành công", "success");
		} catch (error) {
			console.error("Lỗi khi xóa:", error);
			showToast("Lỗi khi xóa", "error");
		}
	};

	const handleEdit = (categoryOfService) => {
		setEditCategoryOS(categoryOfService);
		setShowForm(true);
	};

	const handleFormSubmit = async (newCategoryData) => {
		try {
			if (editCategoryOS) {
				const response =
					await CategoryOfServiceService.updateCategoryOfServices(
						editCategoryOS.id,
						newCategoryData
					);
				setCategoryOSsData(
					categoryOSsData.map((categoryOfService) =>
						categoryOfService.id === editCategoryOS.id
							? response.data
							: categoryOfService
					)
				);
				showToast("Cập nhật thành công", "success");
			} else {
				const response =
					await CategoryOfServiceService.createCategoryOfServices(
						newCategoryData
					);
				setCategoryOSsData([...categoryOSsData, response.data]);
				showToast("Tạo thành công", "success");
			}
			setShowForm(false);
			setEditCategoryOS(null);
		} catch (error) {
			console.error("Lỗi khi lưu:", error);
			showToast("Lỗi khi lưu", "error");
		}
	};

	const handleRowClicked = (row) => {
		setSelectedRow(row);
	};

	const handleActionsClicked = () => {
		setShowActions(!showActions);
	};

	const handleImport = () => {
		alert("");
	};

	const handleExport = () => {
		const exportData = categoryOSsData.map((item) => ({
			ID: item.id,
			Name: item.name,
			Status: item.status === "1" ? "Active" : "Inactive",
		}));
		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "CategoryOSs");
		XLSX.writeFile(workbook, "CategoryOSs_Export.xlsx");
		showToast("Xuất file Excel thành công", "success");
	};

	return (
		<>
			<section>
				<div>
					<header className='bg-white rounded-md p-4 flex items-center justify-between shadow-md'>
						<div className='min-w-fit max-w-md'>
							<FormControl
								type='text'
								placeHolder='Search here...'
								wrapInputStyle='!border-black/10 rounded-md focus-within:!border-[#435d63] transition-all'
								inputStyle='font-serif placeholder:text-lg text-black placeholder:font-serif !p-4 !py-2'
								id='search'
								onChange={(event) =>
									handleFieldsChange("search", event.target.value)
								}
								hasButton
								Icon={CiSearch}
								iconSize={24}
								iconStyle='transition-all text-[#435d63] hover:text-black mx-4'
								hasError={errors?.searchInput}
								errorMessage={errors?.searchInput}
							/>
						</div>

						<div className='relative'>
							<button
								type='submit'
								className='text-sm rounded-md w-fit transition-all duration-700 hover:bg-black text-white bg-[#435d63] p-2 font-serif font-semibold'
								onClick={handleActionsClicked}>
								<p>Action</p>
							</button>
							{showActions && (
								<div className='overflow-hidden absolute z-10 top-full right-0 rounded-md bg-white w-fit shadow-md'>
									<button
										className='p-2 px-4 hover:bg-black/10 w-full'
										onClick={() => {
											setEditCategoryOS(null);
											setShowForm(true);
										}}>
										Create
									</button>
									<button
										className='p-2 px-4 hover:bg-black/10 w-full'
										onClick={handleImport}>
										Import
									</button>
									<button
										className='p-2 px-4 hover:bg-black/10 w-full'
										onClick={handleExport}>
										Export
									</button>
								</div>
							)}
						</div>
					</header>

					<main className='mt-4 rounded-md shadow-md overflow-hidden'>
						{loading ? (
							<Loading />
						) : (
							<DataTable
								customStyles={{
									subHeader: {
										style: { padding: "0", margin: "0", minHeight: "0" },
									},
								}}
								pointerOnHover
								highlightOnHover
								selectableRows
								striped
								pagination
								onSelectedRowsChange={handleRowsSelected}
								subHeader={selectedRows.length ? true : false}
								subHeaderComponent={
									<SubHeader
										selectedRows={selectedRows}
										handleDeleteMultiple={handleDeleteMultiple}
									/>
								}
								columns={columns}
								data={filteredData}
								selectableRowscomponent={SelectBox}
								selectableRowsComponentProps={{
									style: {
										backgroundColor: "white",
										borderColor: "#435d63",
										accentColor: "#435d63",
									},
								}}
								onRowClicked={handleRowClicked}
							/>
						)}
					</main>
				</div>
			</section>

			<Form
				toggle={showForm}
				setToggle={() => {
					setShowForm(false);
					setEditCategoryOS(null);
				}}
				initialData={editCategoryOS}
				onSubmit={handleFormSubmit}
				isDisabled={false}
			/>

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
				title='Are you sure you want to delete this?'
				message='This action can be undone'
				okButtonText='OK'
				cancelButtonText='Cancel'
			/>
		</>
	);
};

export default Categories;
