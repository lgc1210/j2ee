import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Alert, Calendar, ConfigProvider } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import "./index.css";
import AppointmentService from "../../Services/appointment";
import { FaArrowRightLong } from "react-icons/fa6";
import { showToast } from "../../Components/Toast";
import StoreService from "../../Services/store";

const Button = React.lazy(() => import("../Button"));
const BookingSelectTime = React.lazy(() => import("../BookingSelectTime"));
const BookingSelectStaff = React.lazy(() => import("../BookingSelectStaff"));

const BookingSelectDate = ({
	handleInfoChange,
	handleSelectDateTimeStaff,
	selectedServiceId,
	storeId,
}) => {
	const [value, setValue] = useState(() => dayjs(Date.now()));
	const [selectedValue, setSelectedValue] = useState(() => dayjs(Date.now()));
	const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
	const [availableStaff, setAvailableStaff] = useState([]);
	const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
	const [selectedStaffId, setSelectedStaffId] = useState(null);
	const [storeCloseTime, setStoreCloseTime] = useState(null);

	// Fetch store details (including close_time)
	useEffect(() => {
		const fetchStoreDetails = async () => {
			if (!storeId) return;
			try {
				const response = await StoreService.getStoreCloseTimeById(storeId); // Assume this API exists
				if (response.status === 200 && response.data) {
					console.log("Store close time: ", response.data);
					setStoreCloseTime(response.data); // e.g., "19:00:00"
				}
			} catch (error) {
				console.error("Error fetching store details:", error);
				showToast("Failed to load store details", "error");
			}
		};
		fetchStoreDetails();
	}, [storeId]);

	// Fetch available time slots when a date is selected
	const fetchAvailableTimeSlots = useCallback(
		async (date) => {
			if (!selectedServiceId || !storeId) {
				showToast("Service or store information is missing", "error");
				setAvailableTimeSlots([]);
				return;
			}

			try {
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
					showToast("No available time slots found", "warning");
				}
			} catch (error) {
				console.error("Error fetching available time slots:", error);
				showToast("Failed to load available time slots", "error");
				setAvailableTimeSlots([]);
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
					showToast("No staff available for this time slot", "warning");
				}
			} catch (error) {
				console.error("Error fetching available staff:", error);
				showToast("Failed to load available staff", "error");
				setAvailableStaff([]);
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

	const dateFullCellRender = (date) => {
		const day = date.date();
		const isSelected =
			selectedValue &&
			day === selectedValue.date() &&
			date.month() === selectedValue.month() &&
			date.year() === selectedValue.year();

		return (
			<div
				style={{
					textAlign: "center",
					height: "6rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "1.2rem",
					border: "1px #fafafa solid",
					background: isSelected ? "#fff" : "#f5f5f5",
					...(isSelected && {
						border: "1px #ccc solid",
						margin: "auto",
						position: "relative",
					}),
				}}
				onMouseEnter={(e) => {
					if (!isSelected) {
						e.currentTarget.style.background = "#e6e6e6";
					}
				}}
				onMouseLeave={(e) => {
					if (!isSelected) {
						e.currentTarget.style.background = "#f5f5f5";
					}
				}}>
				{isSelected && (
					<div
						style={{
							position: "absolute",
							width: "40px",
							height: "40px",
							border: "2px #000 solid",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: -1,
						}}
					/>
				)}
				<span style={{ position: "relative", zIndex: 1 }}>{day}</span>
			</div>
		);
	};

	const headerRender = ({ value }) => (
		<div
			style={{
				background: "#383838",
				color: "#fff",
				fontSize: "1.1rem",
				padding: "18px",
				textAlign: "center",
				letterSpacing: "0.1rem",
				textTransform: "uppercase",
			}}>
			{value.format("MMMM YYYY")}
		</div>
	);

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
		<Suspense fallback={<div>Loading...</div>}>
			<section className='md:py-36 py-28 md:px-0 px-6'>
				<div className='container mx-auto'>
					<div className='flex flex-col items-center gap-8 relative z-10'>
						<p className='text-[#799aa1] font-sans text-xl text-center'>
							Online Reservation
						</p>
						<p className='lg:text-7xl text-3xl font-serif text-center 2xl:w-1/2 w-full'>
							Booking
						</p>
						<p className='absolute top-0 right-0 left-0 text-center -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
							Calendar
						</p>
					</div>

					<div className='mt-20'>
						<div>
							<Alert
								message={`You selected date: ${selectedValue?.format(
									"YYYY-MM-DD"
								)}`}
								type='info'
							/>
							<ConfigProvider
								theme={{
									components: {
										Calendar: {
											colorBgContainer: "#f5f5f5",
											colorBgHeader: "#333",
											colorTextHeading: "#fff",
											fullPanelHeaderTextAlign: "center",
											fullPanelHeaderPadding: "4px 0",
										},
									},
								}}>
								<Calendar
									value={value}
									onSelect={onSelect}
									onPanelChange={onPanelChange}
									fullCellRender={dateFullCellRender}
									headerRender={headerRender}
									disabledDate={disabledDate}
									className='custom-calendar'
								/>
							</ConfigProvider>
						</div>
						<div>
							<BookingSelectTime
								timeSlots={availableTimeSlots}
								selectedTimeSlot={selectedTimeSlot}
								onSelectTimeSlot={handleTimeSelection}
							/>
							{selectedTimeSlot && (
								<BookingSelectStaff
									availableStaff={availableStaff}
									selectedStaffId={selectedStaffId}
									onSelectStaff={handleStaffSelection}
								/>
							)}
						</div>
					</div>

					<div className='mt-20'>
						<Button
							disable={!canProceed}
							text='Confirm'
							Icon={FaArrowRightLong}
							iconSize={14}
							buttonStyle={`justify-center gap-2 mt-10 mx-auto lg:[&]:py-6 lg:[&]:px-16 lg:[&]:text-lg ${
								!canProceed ? "opacity-50 cursor-not-allowed" : ""
							}`}
							onClick={handleConfirm}
						/>
					</div>
				</div>
			</section>
		</Suspense>
	);
};

export default React.memo(BookingSelectDate);
