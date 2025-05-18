import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline, IoAddOutline, IoEyeOutline } from "react-icons/io5";
import { FiDownload, FiUpload } from "react-icons/fi";
import ConfirmPopup from "../../Components/ConfirmPopup";
import { showToast } from "../../Components/Toast";
import RoleService from "../../Services/role";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import paths from "../../Constants/paths";

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
				title='Delete Multiple Roles'
				message='Are you sure you want to delete the selected roles? This action cannot be undone.'
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

const Roles = () => {
	const [searchInput, setSearchInput] = useState("");
	const [errors, setErrors] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [rolesData, setRolesData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editRole, setEditRole] = useState(null);
	const [showConfirmDeleteSingle, setShowConfirmDeleteSingle] = useState(false);
	const [roleIdToDelete, setRoleIdToDelete] = useState(null);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				setLoading(true);
				const response = await RoleService.getAllRoles();
				setRolesData(response.data || []);
			} catch (error) {
				setRolesData([]);
				showToast("Error loading role list", "error");
			} finally {
				setLoading(false);
			}
		};
		fetchRoles();
	}, []);

	const columns = useMemo(() => {
		return [
			{
				name: "Name",
				sortable: true,
				selector: (row) => row.name,
				cell: (row) => <div className='py-2 text-slate-800'>{row?.name}</div>,
			},
			{
				name: "Actions",
				cell: (row) => {
					return (
						<div className='flex gap-3 py-2'>
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

	const filteredData = useMemo(() => {
		return rolesData.filter((role) => {
			return (
				role?.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
				(role?.description || "")
					.toLowerCase()
					.includes(searchInput.toLowerCase())
			);
		});
	}, [searchInput, rolesData]);

	const handleFieldsChange = (key, value) => {
		setSearchInput(value);
	};

	const handleRowsSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
	};

	const handleDeleteMultiple = async () => {
		const ids = selectedRows.map((row) => row.id);
		try {
			await RoleService.deleteMultipleRoles(ids);
			setRolesData(rolesData.filter((role) => !ids.includes(role.id)));
			setSelectedRows([]);
			showToast("Deleted Successfully", "success");
		} catch (error) {
			console.error("Error deleting multiple roles:", error);
			showToast("Delete failed", "error");
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
			showToast("Deleted Successfully", "success");
		} catch (error) {
			console.error("Error deleting role:", error);
			showToast("Delete failed", "error");
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
				showToast("Updated successfully", "success");
			} else {
				const response = await RoleService.createRole(roleData);
				setRolesData([...rolesData, response.data]);
				showToast("Created successfully", "success");
			}
			setShowForm(false);
			setEditRole(null);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.message || "Error saving role";
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

			// Validate and map Excel data
			const validRoles = [];

			for (const row of jsonData) {
				const role = {
					name: String(row.Name || "").trim(),
					description: String(row.Description || "").trim(),
					status: String(row.Status || "Active").trim(),
				};

				// Validate role data
				if (!role.name) continue;

				// Check for duplicates
				if (
					rolesData.some(
						(r) => r.name.toLowerCase() === role.name.toLowerCase()
					)
				) {
					continue;
				}

				validRoles.push(role);
			}

			if (validRoles.length === 0) {
				showToast("No valid roles found in the Excel file", "error");
				return;
			}

			// Send valid roles to backend
			for (const role of validRoles) {
				await RoleService.createRole(role);
			}
			setRolesData([...rolesData, ...validRoles]);
			showToast(`${validRoles.length} roles imported successfully`, "success");
		} catch (error) {
			showToast(
				error.response?.data?.message || "Error importing roles",
				"error"
			);
		}
	};

	const handleExport = () => {
		const exportData = rolesData.map((role) => ({
			ID: role?.id,
			Name: role?.name,
			Description: role?.description || "N/A",
			Status: role?.status || "Active",
			"Created At": role?.created_at || "N/A",
			"Updated At": role?.updated_at || "N/A",
		}));
		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
		XLSX.writeFile(workbook, "Roles.xlsx");
	};

	return (
		<>
			<section className='px-4 py-6'>
				<div className='max-w-6xl mx-auto'>
					<header className='mb-6'>
						<h1 className='text-2xl font-bold text-slate-800 mb-2'>
							Role Management
						</h1>
						<p className='text-slate-500'>
							View, create, and manage system roles
						</p>
					</header>

					<div className='bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6'>
						<div className='p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200'>
							{/* Search Box */}
							<div className='w-full md:w-96'>
								<FormControl
									type='text'
									placeHolder='Search roles...'
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
										setEditRole(null);
										setShowForm(true);
									}}>
									<IoAddOutline size={18} />
									<span>Add Role</span>
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
								striped
								pagination
								selectableRows
								selectableRowsComponentProps={{
									style: {
										backgroundColor: "white",
										borderColor: "#435d63",
										accentColor: "#435d63",
									},
								}}
								selectableRowsComponent={SelectBox}
								paginationPerPage={10}
								paginationRowsPerPageOptions={[10, 25, 50, 100]}
								subHeader={selectedRows.length > 0}
								subHeaderComponent={
									<SubHeader
										selectedRows={selectedRows}
										handleDeleteMultiple={handleDeleteMultiple}
									/>
								}
								noDataComponent={
									<div className='p-10 text-center text-slate-500'>
										No roles found
									</div>
								}
								onSelectedRowsChange={handleRowsSelected}
								data={filteredData}
								columns={columns}
							/>
						)}
					</div>
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

			<ConfirmPopup
				toggle={showConfirmDeleteSingle}
				setToggle={() => setShowConfirmDeleteSingle(false)}
				onOk={confirmDeleteSingle}
				onCancel={() => setShowConfirmDeleteSingle(false)}
				title='Delete Role'
				message='Are you sure you want to delete this role? This action cannot be undone.'
				okButtonText='Delete'
				cancelButtonText='Cancel'
			/>
		</>
	);
};

export default Roles;
