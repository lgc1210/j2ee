import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { isEmpty } from "../../Utils/validation.js";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmPopup from "../../Components/ConfirmPopup/index.jsx";
import RoleService from "../../Services/role";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../../Components/Toast";
import * as XLSX from "xlsx";
const FormControl = React.lazy(() => import("../../Components/FormControl"));
const Loading = React.lazy(() => import("../../Components/Loading"));
const Form = React.lazy(() => import("./Form"));

const SubHeader = ({ selectedRows, handleDeleteMultiple }) => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	if (selectedRows.length === 0) {
		return null;
	}

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

const Roles = () => {
	const columns = [
		{
			name: "Name",
			sortable: true,
			selector: (row) => row.name,
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
	const [rolesData, setRolesData] = useState([]);
	const [filteredData, setFilteredData] = useState([]); // Thêm trạng thái filteredData
	const [loading, setLoading] = useState(true);
	const [editRole, setEditRole] = useState(null);
	const [showConfirmDeleteSingle, setShowConfirmDeleteSingle] = useState(false);
	const [roleIdToDelete, setRoleIdToDelete] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				setLoading(true);
				const response = await RoleService.getAllRoles();
				setRolesData(response.data);
				setFilteredData(response.data); // Khởi tạo filteredData
			} catch (error) {
				console.error("Lỗi khi lấy danh sách roles:", error);
				showToast("Lỗi khi tải danh sách roles", "error");
			} finally {
				setLoading(false);
			}
		};
		fetchRoles();
	}, []);

	// Lọc dữ liệu khi searchInput hoặc rolesData thay đổi
	useEffect(() => {
		const filtered = rolesData.filter((item) =>
			item.name.toLowerCase().includes(searchInput.toLowerCase())
		);
		setFilteredData(filtered);
	}, [searchInput, rolesData]);

	const handleFieldsChange = (key, value) => {
		setSearchInput(value);
	};

	const handleRowsSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
	};

	const handleDeleteMultiple = async () => {
		const ids = selectedRows.map((row) => row.id);
		console.log("ids:" + ids);
		try {
			await RoleService.deleteMultipleRoles(ids);
			setRolesData(rolesData.filter((role) => !ids.includes(role.id)));
			setSelectedRows([]);
			showToast("Xóa nhiều roles thành công", "success");
		} catch (error) {
			console.error("Lỗi khi xóa nhiều roles:", error);
			showToast("Lỗi khi xóa nhiều roles", "error");
		}
	};

	const handleDeleteSingle = (roleId) => {
		setRoleIdToDelete(roleId);
		setShowConfirmDeleteSingle(true);
	};

	const confirmDeleteSingle = async () => {
		try {
			await RoleService.deleteRole(roleIdToDelete);
			setRolesData(rolesData.filter((role) => role.id !== roleIdToDelete));
			setShowConfirmDeleteSingle(false);
			showToast("Xóa role thành công", "success");
		} catch (error) {
			console.error("Lỗi khi xóa role:", error);
			showToast("Lỗi khi xóa role", "error");
		}
	};

	const handleEdit = (role) => {
		setEditRole(role);
		setShowForm(true);
	};

	const handleFormSubmit = async (roleData) => {
		try {
			if (editRole) {
				const response = await RoleService.updateRole(editRole.id, roleData);
				setRolesData(
					rolesData.map((role) =>
						role.id === editRole.id ? response.data : role
					)
				);
				showToast("Cập nhật role thành công", "success");
			} else {
				const response = await RoleService.createRole(roleData);
				setRolesData([...rolesData, response.data]);
				showToast("Tạo role thành công", "success");
			}
			setShowForm(false);
			setEditRole(null);
		} catch (error) {
			console.error("Lỗi khi lưu role:", error);
			showToast("Lỗi khi lưu role", "error");
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
		const exportData = rolesData.map((role) => ({
			ID: role.id,
			Name: role.name,
		}));
		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
		XLSX.writeFile(workbook, "Roles_Export.xlsx");
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
											setEditRole(null);
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
								selectableRowsComponent={SelectBox}
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
					setEditRole(null);
				}}
				initialData={editRole}
				onSubmit={handleFormSubmit}
				isDisabled={false}
				rolesData={rolesData}
			/>

			<Form
				toggle={!!selectedRow}
				setToggle={() => setSelectedRow(null)}
				initialData={selectedRow}
				onSubmit={() => {}}
				isDisabled={true}
				rolesData={rolesData}
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

export default Roles;
