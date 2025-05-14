import React, { useState, useEffect, lazy, Suspense } from "react";
import Loading from "../../Components/Loading";
import { useAuth } from "../../Contexts/Auth";
import BookingImageBanner from "../../assets/images/Booking/female-hairstylist-drying-curly-girl-s-hair-using-big-plastic-brush-1920x1282.jpeg";
import AppointmentService from "../../Services/appointment";
import { showToast } from "../../Components/Toast";
import { useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";

// Lazy loaded components
const Banner = lazy(() => import("../../Components/Banner"));
const StoresChoosingWrap = lazy(() =>
	import("../../Components/StoresChoosingWrap")
);
const BookingService = lazy(() => import("../../Components/BookingService"));
const BookingSelectDate = lazy(() =>
	import("../../Components/BookingSelectDate")
);

const Booking = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [selectedServiceId, setSelectedServiceId] = useState(null);
	const [selectedStoreId, setSelectedStoreId] = useState(null);
	const { isAuthenticated, user } = useAuth();
	const [info, setInfo] = useState({
		appointment_date: null,
		appointment_time: null,
		status: "Pending",
		customer_id: isAuthenticated ? user?.id : null,
		service_id: null,
		staff_id: null,
		store_id: null,
		notes: "",
	});

	// Track progress in localStorage
	useEffect(() => {
		const savedBookingState = localStorage.getItem("bookingState");
		if (savedBookingState) {
			try {
				const { savedStep, savedInfo, savedServiceId, savedStoreId } =
					JSON.parse(savedBookingState);
				setStep(savedStep);
				setInfo(savedInfo);
				setSelectedServiceId(savedServiceId);
				setSelectedStoreId(savedStoreId);
			} catch (error) {
				console.error("Error restoring booking state:", error);
				localStorage.removeItem("bookingState");
			}
		}
	}, []);

	// Save booking progress
	useEffect(() => {
		if (step > 0) {
			localStorage.setItem(
				"bookingState",
				JSON.stringify({
					savedStep: step,
					savedInfo: info,
					savedServiceId: selectedServiceId,
					savedStoreId: selectedStoreId,
				})
			);
		}
	}, [step, info, selectedServiceId, selectedStoreId]);

	// Update customer_id
	useEffect(() => {
		if (isAuthenticated && user?.id) {
			setInfo((prev) => ({ ...prev, customer_id: user.id }));
		}
	}, [isAuthenticated, user]);

	const handleSelectStore = (storeId) => {
		setSelectedStoreId(storeId);
		handleInfoChange("store_id", storeId);
		handleSetStep(1);
	};

	const handleSelectService = (serviceId) => {
		setSelectedServiceId(serviceId);
		handleInfoChange("service_id", serviceId);
		handleSetStep(2);
	};

	const handleSelectDateTimeAndStaff = (
		appointmentDate,
		appointmentTime,
		staffId
	) => {
		handleInfoChange("appointment_date", appointmentDate);
		handleInfoChange("appointment_time", appointmentTime);
		handleInfoChange("staff_id", staffId);
		handleSubmitBooking();
	};

	const handleInfoChange = (key, value) => {
		setInfo((prev) => ({ ...prev, [key]: value }));
	};

	const handleSetStep = (newStep) => {
		if (newStep === 2 && !isAuthenticated) {
			showToast("Please login to continue with your booking", "warning");
			navigate(paths.login, { replace: true });
			return;
		}
		setStep(newStep);
	};

	const handleResetBooking = () => {
		localStorage.removeItem("bookingState");
		setStep(0);
		setSelectedServiceId(null);
		setSelectedStoreId(null);
		setInfo({
			appointment_date: null,
			appointment_time: null,
			status: "Pending",
			customer_id: isAuthenticated ? user?.id : null,
			service_id: null,
			staff_id: null,
			store_id: null,
			notes: "",
		});
	};

	const handleSubmitBooking = async () => {
		console.log("Info: ", info);
		if (!isAuthenticated) {
			showToast("Please login to complete your booking", "error");
			navigate(paths.login, { replace: true });
			return;
		}

		const requiredFields = [
			{ field: "appointment_date", name: "Appointment Date" },
			{ field: "appointment_time", name: "Appointment Time" },
			{ field: "service_id", name: "Service" },
			{ field: "staff_id", name: "Staff Member" },
			{ field: "store_id", name: "Store" },
		];

		const missingFields = requiredFields.filter((item) => !info[item.field]);

		if (missingFields.length > 0) {
			const missingFieldNames = missingFields
				.map((item) => item.name)
				.join(", ");
			showToast(`Please complete the following: ${missingFieldNames}`, "error");
			return;
		}

		try {
			setLoading(true);
			const response = await AppointmentService.create(info);
			if (response.status === 201 || response.status === 200) {
				showToast("Booking successfully created!", "success");
				localStorage.removeItem("bookingState");
				setStep(3); // Confirmation step
			}
		} catch (error) {
			console.error("Error creating appointment:", error);
			showToast(
				error.response?.data?.message ||
					"Failed to create booking. Please try again.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	const renderBookingStep = () => {
		switch (step) {
			case 0:
				return <StoresChoosingWrap handleSelectStore={handleSelectStore} />;
			case 1:
				return (
					<div className='container mx-auto py-10 md:px-0 px-6'>
						<BookingService
							handleSetStep={handleSetStep} // Add this prop
							setSelectedServiceId={handleSelectService}
							storeId={selectedStoreId}
						/>
					</div>
				);
			case 2:
				return (
					<div className='container mx-auto py-10 md:px-0 px-6'>
						<BookingSelectDate
							handleInfoChange={handleInfoChange}
							handleSelectDateTimeStaff={handleSelectDateTimeAndStaff}
							selectedServiceId={selectedServiceId}
							storeId={selectedStoreId}
							loading={loading}
						/>
					</div>
				);
			case 3:
				return (
					<div className='container mx-auto py-20 md:px-0 px-6 text-center'>
						<div className='bg-green-50 border border-green-200 p-10 max-w-xl mx-auto'>
							<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-8 w-8 text-green-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M5 13l4 4L19 7'
									/>
								</svg>
							</div>
							<h2 className='text-3xl font-serif mb-4'>Booking Confirmed!</h2>
							<p className='text-lg mb-6'>
								Your appointment has been successfully scheduled.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<button
									className='px-6 py-3 bg-[#779AA1] text-white hover:bg-[#5d7a80] transition'
									onClick={() => navigate(paths.profileBooking)}>
									View My Appointments
								</button>
								<button
									className='px-6 py-3 bg-white border border-[#779AA1] text-[#779AA1] hover:bg-[#f0f5f6] transition'
									onClick={handleResetBooking}>
									Book Another Appointment
								</button>
							</div>
						</div>
					</div>
				);
			default:
				return <StoresChoosingWrap handleSelectStore={handleSelectStore} />;
		}
	};

	return (
		<Suspense
			fallback={
				<Loading
					size='h-16 w-16'
					customStyle='w-full h-screen flex flex-col items-center justify-center'
					hasLoadingText
				/>
			}>
			{step < 3 && (
				<div className='fixed top-28 left-0 right-0 z-20 mx-auto max-w-xl px-4'>
					<div className='bg-white rounded-full shadow-md py-2 px-6 border border-[#779aa18e]'>
						<div className='flex justify-between items-center'>
							{["Store", "Service", "Date/Time"].map((label, idx) => (
								<div
									key={idx}
									className={`flex flex-col items-center justify-center ${
										idx <= step ? "text-[#779AA1]" : "text-gray-400"
									} ${idx < step ? "cursor-pointer" : "cursor-default"}`}
									onClick={() => idx < step && handleSetStep(idx)}>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
											idx < step
												? "bg-[#779AA1] text-white"
												: idx === step
												? "border-2 border-[#779AA1] text-[#779AA1]"
												: "border-2 border-gray-300 text-gray-400"
										}`}>
										{idx + 1}
									</div>
									<span className='text-xs block'>{label}</span>
								</div>
							))}
						</div>
						<div className='absolute left-0 right-0 flex justify-between px-8 mt-[-22px] z-[-1]'>
							<div
								className={`h-0.5 flex-1 ${
									step > 0 ? "bg-[#779AA1]" : "bg-gray-300"
								}`}></div>
							<div
								className={`h-0.5 flex-1 ${
									step > 1 ? "bg-[#779AA1]" : "bg-gray-300"
								}`}></div>
						</div>
					</div>
				</div>
			)}

			<Banner
				imageBanner={BookingImageBanner}
				titleBanner='Online Booking'
				pathBanner='Booking'
			/>

			{renderBookingStep()}
		</Suspense>
	);
};

export default Booking;
