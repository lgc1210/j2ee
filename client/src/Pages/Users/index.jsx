import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline, IoAddOutline, IoEyeOutline } from "react-icons/io5";
import { FiDownload, FiUpload } from "react-icons/fi";
import ConfirmPopup from "../../Components/ConfirmPopup";
import { showToast } from "../../Components/Toast";
import UserService from "../../Services/user";
import * as XLSX from "xlsx";
import paths from "../../Constants/paths";
import { Link } from "react-router-dom";
import RoleService from "../../Services/role";
import { isEmail, isPhone } from "../../Utils/validation";

const FormControl = React.lazy(() => import("../../Components/FormControl"));
const Loading = React.lazy(() => import("../../Components/Loading"));
const Form = React.lazy(() => import("./Form"));

const SubHeader = ({ selectedRows, handleDeleteMultiple }) => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	if (selectedRows.length === 0) return null;

	return (
		<>
			<div className='w-full p-3 bg-slate-50 flex items-center justify-between shadow-sm rounded-md'>
				<span className='font-medium text-slate-700'>
					{selectedRows.length} items selected
				</span>
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
				title='Delete Multiple Users'
				message='Are you sure you want to delete the selected users? This action cannot be undone.'
				okButtonText='Delete'
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
			className='w-4 h-4 !text-[#435d63] !bg-[#435d63] border-gray-200 rounded !focus:ring-[#435d63]'
		/>
	);
});

const Users = () => {
	const [searchInput, setSearchInput] = useState("");
	const [errors, setErrors] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [usersData, setUsersData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editUser, setEditUser] = useState(null);
	const [showConfirmDeleteSingle, setShowConfirmDeleteSingle] = useState(false);
	const [userIdToDelete, setUserIdToDelete] = useState(null);
	const [roles, setRoles] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [usersResponse, rolesResponse] = await Promise.all([
					UserService.getAllUses(),
					RoleService.getAllRoles(),
				]);
				setUsersData(usersResponse.data);
				setRoles(rolesResponse?.data || []);
			} catch (error) {
				setUsersData([]);
				setRoles([]);
				showToast("Error loading user list", "error");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const columns = useMemo(() => {
		return [
			{
				name: "Name",
				sortable: true,
				selector: (row) => row.name,
				cell: (row) => <div className='py-2 text-slate-800'>{row.name}</div>,
			},
			{
				name: "Email",
				sortable: true,
				selector: (row) => row.email,
				cell: (row) => (
					<div className='py-2 text-slate-600 cursor-pointer hover:underline'>
						<a href={`mailto:${row.email}`}>{row.email}</a>
					</div>
				),
			},
			{
				name: "Phone",
				sortable: true,
				selector: (row) => row.phone,
				cell: (row) => (
					<div className='py-2 text-slate-600 cursor-pointer hover:underline'>
						<a href={`tel:${row.phone}`}>{row.phone}</a>
					</div>
				),
			},
			{
				name: "Role",
				sortable: true,
				selector: (row) => row.role?.name,
				cell: (row) => (
					<div className='py-2'>
						<span className='px-2 py-1 text-xs font-medium rounded-full bg-[#435d63]/10 text-[#435d63]'>
							{row.role?.name || "N/A"}
						</span>
					</div>
				),
			},
			{
				name: "Actions",
				cell: (row) => {
					return (
						<div className='flex gap-3 py-2'>
							<Link
								to={{
									pathname: paths.userDetails.replace(":id", row?.id),
								}}
								className='p-1 transition-colors hover:bg-black/10 rounded'>
								<IoEyeOutline size={20} />
							</Link>
							<button
								className='p-1 transition-colors hover:bg-black/10 rounded'
								onClick={() => handleEdit(row)}>
								<FaRegEdit size={16} />
							</button>
							<button
								className='p-1 transition-colors hover:bg-black/10 rounded'
								onClick={() => handleDeleteSingle(row.id)}>
								<IoTrashOutline size={18} />
							</button>
						</div>
					);
				},
				ignoreRowClick: true,
			},
		];
	}, []);

	const customStyles = useMemo(() => {
		return {
			subHeader: {
				style: { padding: "0", margin: "0", minHeight: "0" },
			},
			headRow: {
				style: {
					backgroundColor: "#f8fafc",
					borderBottomWidth: "1px",
					borderBottomColor: "#e2e8f0",
					borderBottomStyle: "solid",
					color: "#475569",
					fontSize: "0.875rem",
					fontWeight: "600",
				},
			},
			rows: {
				style: {
					minHeight: "60px",
					fontSize: "0.875rem",
					"&:not(:last-of-type)": {
						borderBottomStyle: "solid",
						borderBottomWidth: "1px",
						borderBottomColor: "#f1f5f9",
					},
					"&:hover": {
						backgroundColor: "#f8fafc",
						cursor: "pointer",
					},
				},
			},
			pagination: {
				style: {
					borderTopWidth: "1px",
					borderTopColor: "#e2e8f0",
					borderTopStyle: "solid",
				},
			},
		};
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
			await UserService.deleteMultipleUsers(ids);
			setUsersData(usersData.filter((user) => !ids.includes(user.id)));
			setSelectedRows([]);
			showToast("Deleted Successfully", "success");
		} catch (error) {
			console.error("Error deleting multiple users:", error);
			showToast("Delete failed", "error");
		}
	};

	const handleDeleteSingle = (userId) => {
		setUserIdToDelete(userId);
		setShowConfirmDeleteSingle(true);
	};

	const confirmDeleteSingle = async () => {
		try {
			const response = await UserService.deleteUser(userIdToDelete);
			response?.status === 200 &&
				setUsersData(usersData.filter((user) => user.id !== userIdToDelete));
			setShowConfirmDeleteSingle(false);
			showToast("Deleted successfully", "success");
		} catch (error) {
			console.error("Error deleting user:", error);
			showToast("Delete failed", "error");
		}
	};

	const handleEdit = (user) => {
		setEditUser(user);
		setShowForm(true);
	};

	const handleFormSubmit = async (newUserData) => {
		try {
			const payload = {
				...newUserData,
				role: { id: Number(newUserData["role"]) },
			};
			if (editUser) {
				const response = await UserService.updateUser(editUser.id, payload);
				setUsersData(
					usersData.map((user) =>
						user.id === editUser.id ? response.data : user
					)
				);
				showToast("User updated successfully", "success");
			} else {
				const response = await UserService.createUser(payload);
				console.log("Payload", payload);
				setUsersData([...usersData, response.data]);
				showToast("User created successfully", "success");
			}
			setShowForm(false);
			setEditUser(null);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.message || "Error saving user";
			throw new Error(errorMessage); // Throw error to be caught in Form component
		}
	};

	const handleImport = async (e) => {
		const file = e.target.files[0];
		if (!file || !file.name.endsWith(".xlsx")) {
			showToast("Invalid file", "error");
			return;
		}

		try {
			const data = await file.arrayBuffer();
			const workbook = XLSX.read(data, { type: "array" });
			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

			// Dynamically check role
			const roleMap = {};
			roles.forEach((role) => {
				if (role.name) {
					roleMap[role.name.toLowerCase()] = role.id;
				}
			});

			// Validate and map Excel data
			const validUsers = [];

			for (const row of jsonData) {
				const user = {
					name: String(row.Name || "").trim(),
					email: String(row.Email || "").trim(),
					phone: String(row.Phone || "").trim(),
					password: String(row.Password || "default123").trim(), // Default password; adjust as needed
					roleId: String(roleMap[String(row.Role || "").toLowerCase()] || ""),
				};

				// Validate user data
				if (!user.name || !user.email || !user.phone || !user.roleId) continue;
				if (!isEmail(user.email)) continue;
				if (!isPhone(user.phone)) continue;

				// Check for duplicates
				if (
					usersData.some(
						(u) =>
							u.email.toLowerCase() === user.email.toLowerCase() ||
							u.phone === user.phone
					)
				) {
					continue;
				}

				validUsers.push(user);
			}

			if (validUsers.length === 0) {
				showToast("No valid users found in the Excel file", "error");
				return;
			}

			// Send valid users to backend
			for (const user of validUsers) {
				await UserService.createUser(user);
			}
			setUsersData([...usersData, ...validUsers]);
			showToast(`${validUsers.length} users imported successfully`, "success");
		} catch (error) {
			showToast(
				error.response?.data?.message || "Error importing users",
				"error"
			);
		}
	};

	const handleExport = () => {
		const exportData = usersData.map((user) => ({
			ID: user?.id,
			Name: user?.name,
			Email: user?.email,
			Phone: user?.phone,
			Role: user?.role?.name || "N/A",
			"Created At": user?.created_at || "N/A",
			"Updated At": user?.update_at || "N/A",
		}));
		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
		XLSX.writeFile(workbook, "Users.xlsx");
	};

	const filteredData = usersData.filter(
		(user) =>
			user?.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
			user?.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
			user?.role?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
			user?.phone === searchInput
	);

	return (
		<>
			<section className='px-4 py-6'>
				<div className='max-w-6xl mx-auto'>
					<header className='mb-6'>
						<h1 className='text-2xl font-bold text-slate-800 mb-2'>
							User Management
						</h1>
						<p className='text-slate-500'>
							View, create, and manage system users
						</p>
					</header>

					<div className='bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6'>
						<div className='p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200'>
							{/* Search Box */}
							<div className='w-full md:w-96'>
								<FormControl
									type='text'
									placeHolder='Search users...'
									wrapInputStyle='border border-slate-300 rounded-lg focus-within:border-[#435d63] focus-within:ring-1 focus-within:ring-[#435d63] transition-all'
									inputStyle='font-sans placeholder:text-slate-400 text-slate-700 !p-2 !px-4'
									id='search'
									onChange={(event) =>
										handleFieldsChange("search", event.target.value)
									}
									hasButton
									Icon={CiSearch}
									iconSize={20}
									iconStyle='text-slate-400 mx-3 hover:text-[#435d63]'
									hasError={errors?.searchInput}
									errorMessage={errors?.searchInput}
								/>
							</div>

							{/* Action Buttons */}
							<div className='flex items-center gap-2 w-full md:w-auto justify-end'>
								<button className='flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 hover:scale-[0.98] rounded-lg hover:bg-slate-200 transition-all'>
									<FiUpload size={16} />
									<label
										htmlFor='import'
										className='hidden sm:inline cursor-pointer'>
										Import
									</label>
									<input
										id='import'
										type='file'
										accept='.xlsx'
										hidden
										onChange={handleImport}
									/>
								</button>
								<button
									className='flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 hover:scale-[0.98] rounded-lg hover:bg-slate-200 transition-all'
									onClick={handleExport}>
									<FiDownload size={16} />
									<span className='hidden sm:inline'>Export</span>
								</button>
								<button
									className='flex items-center gap-1 px-3 py-2 bg-[#435d63] hover:scale-[0.98] text-white rounded-lg transition-all'
									onClick={() => {
										setEditUser(null);
										setShowForm(true);
									}}>
									<IoAddOutline size={18} />
									<span>Add User</span>
								</button>
							</div>
						</div>

						{loading ? (
							<div className='flex items-center justify-center py-16'>
								<Loading />
							</div>
						) : (
							<DataTable
								customStyles={customStyles}
								responsive
								highlightOnHover
								selectableRows
								selectableRowsComponentProps={{
									style: {
										backgroundColor: "white",
										borderColor: "#435d63",
										accentColor: "#435d63",
									},
								}}
								striped
								pagination
								paginationPerPage={10}
								paginationRowsPerPageOptions={[10, 25, 50, 100]}
								onSelectedRowsChange={handleRowsSelected}
								subHeader={selectedRows.length > 0}
								subHeaderComponent={
									<SubHeader
										selectedRows={selectedRows}
										handleDeleteMultiple={handleDeleteMultiple}
									/>
								}
								selectableRowsComponent={SelectBox}
								noDataComponent={
									<div className='p-10 text-center text-slate-500'>
										No users found
									</div>
								}
								columns={columns}
								data={filteredData}
							/>
						)}
					</div>
				</div>
			</section>

			<Form
				toggle={showForm}
				setToggle={() => {
					setShowForm(false);
					setEditUser(null);
				}}
				initialData={editUser}
				onSubmit={handleFormSubmit}
				isDisabled={false}
				usersData={usersData}
				roles={roles}
			/>

			<ConfirmPopup
				toggle={showConfirmDeleteSingle}
				setToggle={() => setShowConfirmDeleteSingle(false)}
				onOk={confirmDeleteSingle}
				onCancel={() => setShowConfirmDeleteSingle(false)}
				title='Delete User'
				message='Are you sure you want to delete this user? This action cannot be undone.'
				okButtonText='Delete'
				cancelButtonText='Cancel'
			/>
		</>
	);
};

export default Users;
