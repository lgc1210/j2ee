import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline, IoEyeOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import ConfirmPopup from "../../Components/ConfirmPopup";
import { showToast } from "../../Components/Toast";
import StoreService from "../../Services/store";
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
				title='Delete Multiple Stores'
				message='Are you sure you want to delete the selected stores? This action cannot be undone.'
				okButtonText='Delete'
				cancelButtonText='Cancel'
			/>
		</>
	);
};

const Stores = () => {
	const [searchInput, setSearchInput] = useState("");
	const [errors, setErrors] = useState("");
	const [selectedRows, setSelectedRows] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [storesData, setStoresData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editStore, setEditStore] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await StoreService.getAllForAdmin();
				setStoresData(response.data || []);
			} catch (error) {
				setStoresData([]);
				showToast("Error loading store list", "error");
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
							alt={row.name || "Store"}
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
				name: "Owner",
				sortable: true,
				selector: (row) => row.owner?.name,
				cell: (row) => (
					<Link
						to={paths.userDetails.replace(":id", row?.owner?.id)}
						className='py-2 text-slate-600 hover:underline cursor-pointer'>
						{row.owner?.name || "N/A"}
					</Link>
				),
			},
			{
				name: "Status",
				sortable: true,
				selector: (row) => row?.status,
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
				cell: (row) => {
					return (
						<div className='flex gap-3 py-2'>
							<Link
								to={{
									pathname: paths?.storeDetails?.replace(":id", row?.id),
								}}
								className='p-1 transition-colors hover:bg-black/10 rounded'>
								<IoEyeOutline size={20} />
							</Link>
							<button
								className='p-1 transition-colors hover:bg-black/10 rounded'
								onClick={() => handleEdit(row)}>
								<FaRegEdit size={16} />
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
		return storesData.filter((store) => {
			return (
				store?.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
				(store?.description || "")
					.toLowerCase()
					.includes(searchInput.toLowerCase()) ||
				(store?.owner?.name || "")
					.toLowerCase()
					.includes(searchInput.toLowerCase()) ||
				(store?.address || "").toLowerCase().includes(searchInput.toLowerCase())
			);
		});
	}, [searchInput, storesData]);

	const handleFieldsChange = (key, value) => {
		setSearchInput(value);
	};

	const handleDeleteMultiple = async () => {
		const ids = selectedRows.map((row) => row.id);
		try {
			await StoreService.deleteMultipleStores(ids);
			setStoresData(storesData.filter((store) => !ids.includes(store.id)));
			setSelectedRows([]);
			showToast("Deleted Successfully", "success");
		} catch (error) {
			console.error("Error deleting multiple stores:", error);
			showToast("Delete failed", "error");
		}
	};

	const handleEdit = (store) => {
		setEditStore(store);
		setShowForm(true);
	};

	const handleFormSubmit = async (data) => {
		try {
			const transformedData = {
				name: data.name,
				description: data.description,
				address: data.address,
				phone: data.phone,
				open_time: data.open_time,
				close_time: data.close_time,
				status: data.status,
			};
			const formData = new FormData();
			formData.append(
				"store",
				new Blob([JSON.stringify(transformedData)], {
					type: "application/json",
				})
			);
			if (data.image) {
				formData.append("image", data.image);
			}

			if (editStore) {
				const response = await StoreService.updateStore(editStore.id, formData);
				setStoresData(
					storesData.map((store) =>
						store.id === editStore.id ? response.data : store
					)
				);
				showToast("Updated successfully");
			}
			setShowForm(false);
			setEditStore(null);
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.message || "Error saving store";
			throw new Error(errorMessage); // Throw error to be caught in Form component
		}
	};

	const handleExport = () => {
		const exportData = storesData.map((store) => ({
			ID: store?.id,
			Name: store?.name,
			Description: store?.description || "N/A",
			Address: store?.address || "N/A",
			Phone: store?.phone || "N/A",
			Owner: store?.owner?.name || "N/A",
			Status: store?.status || "N/A",
			"Open Time": store?.open_time || "N/A",
			"Close Time": store?.close_time || "N/A",
			"Created At": store?.created_at || "N/A",
			"Updated At": store?.updated_at || "N/A",
		}));
		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Stores");
		XLSX.writeFile(workbook, "Stores.xlsx");
	};

	return (
		<>
			<section className='px-4 py-6'>
				<div className='max-w-6xl mx-auto'>
					<header className='mb-6'>
						<h1 className='text-2xl font-bold text-slate-800 mb-2'>
							Store Management
						</h1>
						<p className='text-slate-500'>
							View, create, and manage system stores
						</p>
					</header>

					<div className='bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6'>
						<div className='p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200'>
							{/* Search Box */}
							<div className='w-full md:w-96'>
								<FormControl
									type='text'
									placeHolder='Search stores...'
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
								<button
									className='flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 hover:scale-[0.98] rounded-lg hover:bg-slate-200 transition-all'
									onClick={handleExport}>
									<FiDownload size={16} />
									<span className='hidden sm:inline'>Export</span>
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
										No users found
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
					setEditStore(null);
				}}
				initialData={editStore}
				onSubmit={handleFormSubmit}
				isDisabled={false}
			/>
		</>
	);
};

export default Stores;
