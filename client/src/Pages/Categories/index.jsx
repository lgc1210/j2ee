import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline, IoAddOutline, IoEyeOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import ConfirmPopup from "../../Components/ConfirmPopup";
import { showToast } from "../../Components/Toast";
import CategoryOfServiceService from "../../Services/categoryOfService";
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
				title='Delete Multiple Categories'
				message='Are you sure you want to delete the selected categories? This action cannot be undone.'
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

const Categories = () => {
	const [searchInput, setSearchInput] = useState("");
	const [errors, setErrors] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [categoryOSsData, setCategoryOSsData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editCategoryOS, setEditCategoryOS] = useState(null);
	const [showConfirmDeleteSingle, setShowConfirmDeleteSingle] = useState(false);
	const [categoryOSIdToDelete, setCategoryOSIdToDelete] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response =
					await CategoryOfServiceService.getAllCategoryOfServices();
				setCategoryOSsData(response.data || []);
			} catch (error) {
				setCategoryOSsData([]);
				showToast("Error loading category list", "error");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const columns = useMemo(() => {
		return [
			{
				name: "Image",
				cell: (row) => (
					<div className='py-2'>
						<img
							src={
								row.imageBase64 ||
								"https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg"
							}
							alt={row.name || "Category"}
							className='w-14 h-14 rounded-md object-cover border'
						/>
					</div>
				),
			},
			{
				name: "Name",
				sortable: true,
				selector: (row) => row.name,
				cell: (row) => <div className='py-2 text-slate-800'>{row?.name}</div>,
			},
			{
				name: "Status",
				sortable: true,
				selector: (row) => row.status,
				cell: (row) => (
					<div className='py-2'>
						<span
							className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
								row?.status?.toLowerCase() === "active"
									? "bg-[#435d63]/10 text-[#435d63]"
									: "bg-red-400/10 text-red-500"
							}`}>
							{row?.status}
						</span>
					</div>
				),
			},
			{
				name: "Actions",
				cell: (row) => (
					<div className='flex gap-3 py-2'>
						<Link
							to={{
								pathname: paths?.categoryDetails?.replace(":id", row?.id),
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
				),
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
		return categoryOSsData.filter((category) =>
			category?.name?.toLowerCase().includes(searchInput.toLowerCase())
		);
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
				categoryOSsData.filter((category) => !ids.includes(category.id))
			);
			setSelectedRows([]);
			showToast("Deleted Successfully", "success");
		} catch (error) {
			console.error("Error deleting multiple categories:", error);
			showToast("Delete failed", "error");
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
					(category) => category.id !== categoryOSIdToDelete
				)
			);
			setShowConfirmDeleteSingle(false);
			showToast("Deleted Successfully", "success");
		} catch (error) {
			console.error("Error deleting category:", error);
			showToast("Delete failed", "error");
		}
	};

	const handleEdit = (category) => {
		setEditCategoryOS(category);
		setShowForm(true);
	};

	const handleFormSubmit = async (data) => {
		try {
			const transformedData = {
				name: data.name,
				status: data.status,
			};

			// Check if we're updating an existing category
			if (editCategoryOS?.id) {
				// Make sure to include the ID in transformedData
				transformedData.id = editCategoryOS.id;

				const formData = new FormData();
				formData.append(
					"categoryOfService",
					new Blob([JSON.stringify(transformedData)], {
						type: "application/json",
					})
				);

				if (data.image) {
					formData.append("image", data.image);
				}

				// Use the ID from editCategoryOS for the update
				const response =
					await CategoryOfServiceService.updateCategoryOfServices(
						editCategoryOS.id,
						formData
					);

				// Update the state with the complete response data from the API
				if (response && response.data) {
					setCategoryOSsData(
						categoryOSsData.map((category) =>
							category.id === editCategoryOS.id
								? response.data // Use the complete updated object from API
								: category
						)
					);
				} else {
					// Fallback if no response data is available
					setCategoryOSsData(
						categoryOSsData.map((category) =>
							category.id === editCategoryOS.id
								? {
										...category, // Keep all existing properties
										...transformedData, // Update with new values
										// If image was updated but we don't have response data,
										// we'll need to reload to see the new image
								  }
								: category
						)
					);
				}

				showToast("Updated successfully");
			} else {
				// Create new category
				const formData = new FormData();
				formData.append(
					"categoryOfService",
					new Blob([JSON.stringify(transformedData)], {
						type: "application/json",
					})
				);

				if (data.image) {
					formData.append("image", data.image);
				}

				const response =
					await CategoryOfServiceService.createCategoryOfServices(formData);

				// Add the new category to the list with the ID from response
				if (response && response.data) {
					// Simply add the new category to the existing array
					setCategoryOSsData([...categoryOSsData, response.data]);
				}

				showToast("Created successfully");
			}

			setShowForm(false);
			setEditCategoryOS(null);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Error saving category";
			showToast(errorMessage, "error");
			throw new Error(errorMessage);
		}
	};

	const handleExport = () => {
		const exportData = categoryOSsData.map((item) => ({
			ID: item.id,
			Name: item.name,
			Status: item.status,
		}));
		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
		XLSX.writeFile(workbook, "Categories.xlsx");
	};

	return (
		<>
			<section className='px-4 py-6'>
				<div className='max-w-6xl mx-auto'>
					<header className='mb-6'>
						<h1 className='text-2xl font-bold text-slate-800 mb-2'>
							Category Management
						</h1>
						<p className='text-slate-500'>
							View, create, and manage system categories
						</p>
					</header>

					<div className='bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6'>
						<div className='p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200'>
							<div className='w-full md:w-96'>
								<FormControl
									type='text'
									placeHolder='Search categories...'
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

							<div className='flex items-center gap-2 w-full md:w-auto justify-end'>
								<button
									className='flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 hover:scale-[0.98] rounded-lg hover:bg-slate-200 transition-all'
									onClick={handleExport}>
									<FiDownload size={16} />
									<span className='hidden sm:inline'>Export</span>
								</button>
								<button
									className='flex items-center gap-1 px-3 py-2 bg-[#435d63] hover:scale-[0.98] text-white rounded-lg transition-all'
									onClick={() => {
										setEditCategoryOS(null);
										setShowForm(true);
									}}>
									<IoAddOutline size={18} />
									<span>Add Category</span>
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
										No categories found
									</div>
								}
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
					setEditCategoryOS(null);
				}}
				initialData={editCategoryOS}
				onSubmit={handleFormSubmit}
				isDisabled={false}
			/>

			<ConfirmPopup
				toggle={showConfirmDeleteSingle}
				setToggle={() => setShowConfirmDeleteSingle(false)}
				onOk={confirmDeleteSingle}
				onCancel={() => setShowConfirmDeleteSingle(false)}
				title='Delete Category'
				message='Are you sure you want to delete this category? This action cannot be undone.'
				okButtonText='Delete'
				cancelButtonText='Cancel'
			/>
		</>
	);
};

export default Categories;
