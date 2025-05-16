import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Alert, Calendar, ConfigProvider } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import "./index.css";
import AppointmentService from "../../Services/appointment";
import StoreService from "../../Services/store";

const Button = React.lazy(() => import("../Button"));
const BookingSelectTime = React.lazy(() => import("../BookingSelectTime"));
const BookingSelectStaff = React.lazy(() => import("../BookingSelectStaff"));

const BookingSelectDate = ({
	handleInfoChange,
	handleSelectDateTimeStaff,
	selectedServiceId,
	storeId,
	loading,
}) => {
	const [value, setValue] = useState(() => dayjs(Date.now()));
	const [selectedValue, setSelectedValue] = useState(() => dayjs(Date.now()));
	const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
	const [availableStaff, setAvailableStaff] = useState([]);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
	const [selectedStaffId, setSelectedStaffId] = useState(null);
	const [storeCloseTime, setStoreCloseTime] = useState(null);
	const [fetchingTimeSlots, setFetchingTimeSlots] = useState(false);
	const [fetchingStaff, setFetchingStaff] = useState(false);

	// Fetch store details (including close_time)
	useEffect(() => {
		const fetchStoreDetails = async () => {
			if (!storeId) return;
			try {
				const response = await StoreService.getStoreCloseTimeById(storeId);
				if (response.status === 200 && response.data) {
					setStoreCloseTime(response.data);
				}
			} catch (error) {
				console.error("Error fetching store details:", error);
			}
		};
		fetchStoreDetails();
	}, [storeId]);

	// Fetch available time slots when a date is selected
	const fetchAvailableTimeSlots = useCallback(
		async (date) => {
			if (!selectedServiceId || !storeId) {
				setAvailableTimeSlots([]);
				return;
			}

			try {
				setFetchingTimeSlots(true);
				const formattedDate = date.format("YYYY-MM-DD");
				const response = await AppointmentService.getAvailableTimeSlots(
					storeId,
					selectedServiceId,
					formattedDate
				);
				if (response.status === 200 && Array.isArray(response.data)) {
					setAvailableTimeSlots(response.data);
				} else {
					setAvailableTimeSlots([]);
				}
			} catch (error) {
				console.error("Error fetching available time slots:", error);
				setAvailableTimeSlots([]);
			} finally {
				setFetchingTimeSlots(false);
			}
		},
		[selectedServiceId, storeId]
	);

	// Fetch available staff when a time slot is selected
	const fetchAvailableStaff = useCallback(
		async (timeSlot) => {
			if (!selectedServiceId || !storeId || !timeSlot) {
				setAvailableStaff([]);
				return;
			}

			try {
				setFetchingStaff(true);
				const formattedDate = selectedValue.format("YYYY-MM-DD");
				const response = await AppointmentService.getAvailableStaff(
					storeId,
					selectedServiceId,
					formattedDate,
					timeSlot.startTime,
					timeSlot.endTime
				);
				if (response.status === 200 && Array.isArray(response.data)) {
					setAvailableStaff(response.data);
				} else {
					setAvailableStaff([]);
				}
			} catch (error) {
				console.error("Error fetching available staff:", error);
				setAvailableStaff([]);
			} finally {
				setFetchingStaff(false);
			}
		},
		[selectedServiceId, storeId, selectedValue]
	);

	useEffect(() => {
		fetchAvailableTimeSlots(selectedValue);
	}, [fetchAvailableTimeSlots, selectedValue]);

	const onSelect = (newValue) => {
		setValue(newValue);
		setSelectedValue(newValue);
		setSelectedTimeSlot(null);
		setSelectedStaffId(null);
		setAvailableStaff([]);
		handleInfoChange("appointment_date", newValue.format("YYYY-MM-DD"));
	};

	const onPanelChange = (newValue) => {
		setValue(newValue);
	};

	const disabledDate = (current) => {
		if (!current) return false;

		const now = moment();
		const currentDate = moment(current.toDate());

		// Disable past dates
		if (currentDate.isBefore(now, "day")) {
			return true;
		}

		// If the date is today, disable it if the current time is past the store's closing time
		if (currentDate.isSame(now, "day") && storeCloseTime) {
			const closingTimeToday = moment(
				`${now.format("YYYY-MM-DD")} ${storeCloseTime}`,
				"YYYY-MM-DD HH:mm"
			);
			return now.isAfter(closingTimeToday);
		}

		return false;
	};

	const handleTimeSelection = (slot) => {
		setSelectedTimeSlot(slot);
		setSelectedStaffId(null);
		fetchAvailableStaff(slot);
		const formattedTime = slot.startTime.split(":").slice(0, 2).join(":");
		handleInfoChange("appointment_time", formattedTime);
	};

	const handleStaffSelection = (staffId) => {
		setSelectedStaffId(staffId);
		handleInfoChange("staff_id", staffId);
	};

	// Check if the selected time is in the past (for today only)
	const isSelectedTimeInPast = () => {
		if (!selectedTimeSlot || !selectedValue) return false;

		const now = moment();
		const selectedDate = moment(selectedValue.toDate());

		// Only check if the selected date is today
		if (selectedDate.isSame(now, "day")) {
			const selectedTime = moment(
				`${selectedDate.format("YYYY-MM-DD")} ${selectedTimeSlot.startTime}`,
				"YYYY-MM-DD HH:mm:ss"
			);
			return now.isAfter(selectedTime);
		}

		return false;
	};

	const canProceed =
		selectedValue &&
		selectedTimeSlot &&
		selectedStaffId &&
		!isSelectedTimeInPast();

	const handleConfirm = () => {
		if (canProceed) {
			const formattedTime = selectedTimeSlot.startTime
				.split(":")
				.slice(0, 2)
				.join(":");
			handleSelectDateTimeStaff(
				selectedValue.format("YYYY-MM-DD"),
				formattedTime,
				selectedStaffId
			);
		}
	};

	return (
		<Suspense
			fallback={
				<div className='flex justify-center items-center py-10'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#435D63]'></div>
				</div>
			}>
			<div className='max-w-6xl mx-auto'>
				<div className='mb-16 text-center relative'>
					<h2 className='text-3xl font-serif mb-3 text-gray-800 relative z-10'>
						Schedule Your Appointment
					</h2>
					<div className='w-24 h-1 bg-[#435D63] mx-auto mb-4'></div>
					<p className='text-gray-600 max-w-2xl mx-auto'>
						Select your preferred date and time, and we'll pair you with the
						perfect specialist.
					</p>
					<div className='absolute top-0 right-0 left-0 text-center -translate-y-1/2 leading-none font-sans text-8xl text-gray-100/40 capitalize font-bold select-none'>
						Calendar
					</div>
				</div>

				<div className='bg-white shadow-sm rounded-xl overflow-hidden mb-12'>
					<div className='flex flex-col lg:flex-row'>
						{/* Calendar section */}
						<div className='lg:w-7/12 w-full'>
							<div className='p-4 bg-[#435D63] text-white text-center'>
								<h3 className='text-xl font-medium'>
									{selectedValue?.format("MMMM YYYY")}
								</h3>
							</div>

							<ConfigProvider
								theme={{
									components: {
										Calendar: {
											colorPrimary: "#435D63",
											colorBgContainer: "#ffffff",
											colorBorderSecondary: "#f0f0f0",
											fontSizeHeading5: 16,
											borderRadiusLG: 0,
										},
									},
								}}>
								<Calendar
									value={value}
									onSelect={onSelect}
									onPanelChange={onPanelChange}
									disabledDate={disabledDate}
									fullscreen={false}
									className='minimalist-calendar'
									headerRender={() => null} // Hide default header
								/>
							</ConfigProvider>
						</div>

						{/* Selections section */}
						<div className='lg:w-5/12 w-full bg-gray-50 p-6'>
							<div className='bg-white rounded-lg p-4 shadow-sm mb-6'>
								<div className='flex items-center mb-3'>
									<svg
										className='w-5 h-5 text-[#435D63] mr-2'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'>
										<rect
											x='3'
											y='4'
											width='18'
											height='18'
											rx='2'
											ry='2'></rect>
										<line x1='16' y1='2' x2='16' y2='6'></line>
										<line x1='8' y1='2' x2='8' y2='6'></line>
										<line x1='3' y1='10' x2='21' y2='10'></line>
									</svg>
									<span className='font-medium'>Selected Date</span>
								</div>
								<p className='text-gray-700 text-lg'>
									{selectedValue?.format("dddd, MMMM D, YYYY")}
								</p>
							</div>

							<BookingSelectTime
								timeSlots={availableTimeSlots}
								selectedTimeSlot={selectedTimeSlot}
								onSelectTimeSlot={handleTimeSelection}
								isLoading={fetchingTimeSlots}
							/>

							{selectedTimeSlot && (
								<BookingSelectStaff
									availableStaff={availableStaff}
									selectedStaffId={selectedStaffId}
									onSelectStaff={handleStaffSelection}
									isLoading={fetchingStaff}
								/>
							)}
						</div>
					</div>
				</div>

				<div className='text-center'>
					<button
						disabled={!canProceed || loading}
						onClick={handleConfirm}
						className={`
              px-10 py-4 bg-[#435D63] text-white rounded-lg font-medium
              transition-all duration-300 inline-flex items-center gap-2
              ${
								!canProceed || loading
									? "opacity-50 cursor-not-allowed bg-gray-400"
									: "hover:bg-[#364a4f] shadow-sm"
							}
            `}>
						{loading ? (
							<>
								<svg
									className='animate-spin h-5 w-5 mr-2'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
								</svg>
								Processing...
							</>
						) : (
							<>
								Confirm Booking
								<svg
									className='w-5 h-5'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<line x1='5' y1='12' x2='19' y2='12'></line>
									<polyline points='12 5 19 12 12 19'></polyline>
								</svg>
							</>
						)}
					</button>
				</div>
			</div>
		</Suspense>
	);
};

export default React.memo(BookingSelectDate);
