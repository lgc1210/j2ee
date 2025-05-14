import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { IoTrashOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { useProfile } from "../../Contexts/Profile";
import FormControl from "../../Components/FormControl";

const Loading = React.lazy(() => import("../../Components/Loading"));

const columns = [
	{
		name: "No",
		selector: (_, index) => index + 1,
	},
	{
		name: "Appointment date",
		sortable: true,
		selector: (row) => row.appointment_date,
	},
	{
		name: "Appointment time",
		sortable: true,
		selector: (row) => row.appointment_time,
	},
	{
		name: "Status",
		sortable: true,
		selector: (row) => row.status,
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
		name: "Store",
		sortable: true,
		selector: (row) => row.store.name,
	},
];

const ProfileBooking = () => {
	const [searchInput, setSearchInput] = React.useState("");
	const [errors, setErrors] = React.useState("");
	const [showActions, setShowActions] = React.useState(false);
	const [selectedRows, setSelectedRows] = React.useState([]);
	const {
		historyAppointmentList,
		loadingHistoryAppointmentList,
		fetchHistoryAppointmentList,
	} = useProfile();

	useEffect(() => {
		fetchHistoryAppointmentList();
	}, [fetchHistoryAppointmentList]);

	const handleActionsClicked = () => {
		setShowActions(!showActions);
	};

	const handleRowsSelected = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
	};

	return (
		<React.Suspense
			fallback={
				<Loading
					size='h-16 w-16'
					customStyle='w-full h-screen flex flex-col items-center justify-center'
					hasLoadingText
				/>
			}>
			<section className='flex-grow bg-white rounded-md shadow-md p-4'>
				<div className=''>
					<div className='mb-2'>
						<div className='mb-4'>
							<p className='font-bold'>Booking History</p>
							<p className='text-black/50 font-semibold'>
								Track and manage your booking process
							</p>
						</div>

						<div className='min-w-fit max-w-xs'>
							<FormControl
								type='text'
								placeHolder='Search here...'
								wrapInputStyle='!border-black/10 rounded-md focus-within:!border-[#435d63] transition-all'
								inputStyle='font-serif placeholder:text-lg text-black placeholder:font-serif !p-4 !py-2'
								id='search'
								onChange={(event) => setSearchInput(event.target.value)}
								hasButton
								Icon={CiSearch}
								iconSize={24}
								iconStyle='transition-all text-[#435d63] hover:text-black mx-4'
								hasError={errors?.searchInput}
								errorMessage={errors?.searchInput}
							/>
						</div>
					</div>

					{/* Appointment list */}
					<div className='p-4 rounded-md border border-black/10'>
						<DataTable
							pointerOnHover
							highlightOnHover
							striped
							pagination
							onSelectedRowsChange={handleRowsSelected}
							subHeader={selectedRows.length ? true : false}
							columns={columns}
							data={historyAppointmentList}
							selectableRowsComponentProps={{
								style: {
									backgroundColor: "white",
									borderColor: "#435d63",
									accentColor: "#435d63",
								},
							}}
						/>
					</div>
				</div>
			</section>
		</React.Suspense>
	);
};

export default ProfileBooking;
