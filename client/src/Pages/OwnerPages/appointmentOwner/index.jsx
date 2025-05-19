import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { isEmpty } from "../../../Utils/validation.js";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmPopup from "../../../Components/ConfirmPopup/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../../../Components/Toast/index.jsx";
import UserService from "../../../Services/user";
import * as XLSX from "xlsx";
import { useAppointment } from "../../../Contexts/Appointment/index.jsx";
import AppointmentService from "../../../Services/appointment/index.js";

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
			<div className='w-full p-5 bg-gray-100 flex items-center justify-between'>
				<span>{selectedRows.length} selected rows</span>
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

const AppointmentOwner = () => {
	const [searchInput, setSearchInput] = useState("");
	const [errors, setErrors] = useState("");
	const [showActions, setShowActions] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const {
		currentStoreAppointments,
		fetchCurrentStoreAppointments,
		loading,
		setLoading,
	} = useAppointment();
	const [editAppointment, setEditAppointment] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);

	useEffect(() => {
		const initData = async () => {
			console.log("Current store appointments:", currentStoreAppointments);
			await fetchCurrentStoreAppointments();
		};
		initData();
	}, []);

	const columns = [
		{
			name: "Appointment Date",
			sortable: true,
			selector: (row) => row.appointment_date,
		},
		{
			name: "Appointment Time",
			sortable: true,
			selector: (row) => row.appointment_time,
		},
		{
			name: "Customer",
			sortable: true,
			selector: (row) => row.customer.name,
		},
		{
			name: "Service",
			sortable: true,
			selector: (row) => row.service.name,
		},
		{
			name: "Staff",
			sortable: true,
			selector: (row) => row.staff.name,
		},
		{
			name: "Status",
			sortable: true,
			selector: (row) => row.status,
		},
		{
			name: "Actions",
			center: true,
			cell: (row) => (
				<div className='flex gap-2'>
					<FaRegEdit
						className={`cursor-pointer ${
							row.status === ("Completed" || "Canceled")
								? "text-gray-400 pointer-events-none"
								: "text-black"
						}`}
						size={18}
						onClick={() => handleEdit(row)}
					/>
				</div>
			),
			ignoreRowClick: true,
		},
	];

	const handleFieldsChange = (key, value) => {
		setSearchInput(value);
	};

	const handleRowsSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
	};

	const handleCancelMultiple = async () => {
		const ids = selectedRows.map((row) => row.id);
		try {
			await UserService.deleteMultipleUsers(ids);
			//setUsersData(usersData.filter((user) => !ids.includes(user.id)));
			setSelectedRows([]);
			showToast("Xóa nhiều thành công", "success");
		} catch (error) {
			console.error("Lỗi khi xóa nhiều:", error);
			showToast("Lỗi khi xóa nhiều", "error");
		}
	};

	const handleEdit = (appointment) => {
		setShowForm(true);
		setEditAppointment(appointment);
	};

	const handleFormSubmit = async (newUserData) => {
		// try {
		//   if (editUser) {
		//     const response = await UserService.updateUser(editUser.id, newUserData);
		//     setUsersData(
		//       usersData.map((user) =>
		//         user.id === editUser.id ? response.data : user
		//       )
		//     );
		//     showToast("Cập nhật thành công", "success");
		//   } else {
		//     const response = await UserService.createUser(newUserData);
		//     setUsersData([...usersData, response.data]);
		//     showToast("Tạo thành công", "success");
		//   }
		//   setShowForm(false);
		//   setEditUser(null);
		// } catch (error) {
		//   console.error("Lỗi khi lưu:", error);
		//   const errorMessage =
		//     typeof error === "string" ? error : error.message || "Lỗi";
		//   showToast(`Lỗi khi lưu: ${errorMessage}`, "error");
		// }
	};

	const handleRowClicked = (row) => {
		setSelectedRow(row);
	};

	const handleActionsClicked = () => {
		setShowActions(!showActions);
	};

	const handleImport = () => {
		alert("Developing.");
	};

	const handleExport = () => {
		alert("Developing.");
	};

	// const filteredData = usersData.filter((user) =>
	//   user.name.toLowerCase().includes(searchInput.toLowerCase())
	// );

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
								type='button'
								className='text-sm rounded-md w-fit transition-all duration-700 hover:bg-black text-white bg-[#435d63] p-2 font-serif font-semibold'
								onClick={handleActionsClicked}>
								<p>Action</p>
							</button>
							{showActions && (
								<div className='overflow-hidden absolute z-10 top-full right-0 rounded-md bg-white w-fit shadow-md'>
									<button
										className='p-2 px-4 hover:bg-black/10 w-full'
										onClick={handleExport}>
										Export
									</button>
									<button
										className='p-2 px-4 hover:bg-black/10 w-full'
										onClick={handleImport}>
										Import
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
								subHeader={selectedRows.length > 0}
								subHeaderComponent={
									<SubHeader
										selectedRows={selectedRows}
										handleDeleteMultiple={handleCancelMultiple}
									/>
								}
								columns={columns}
								data={currentStoreAppointments}
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
					setEditAppointment(null);
				}}
				initialData={editAppointment}
				onSubmit={handleFormSubmit}
				isDisabled={false}
				fetchCurrentStoreAppointments={fetchCurrentStoreAppointments}
			/>

			<Form
				toggle={!!selectedRow}
				setToggle={() => setSelectedRow(null)}
				initialData={selectedRow}
				onSubmit={() => {}}
				isDisabled={true}
				check={"hi"}
			/>
		</>
	);
};

export default AppointmentOwner;
