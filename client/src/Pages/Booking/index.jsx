import { useState, useEffect, lazy, Suspense } from "react";
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
		payment_method: null,
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
		handleSetStep(3);
	};

	const handleSelectPaymentMethod = (method) => {
		handleInfoChange("payment_method", method);
		handleSubmitBooking();
	};

	const handleInfoChange = (key, value) => {
		setInfo((prev) => ({ ...prev, [key]: value }));
	};

	const handleSetStep = (newStep) => {
		if (newStep >= 2 && !isAuthenticated) {
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
			payment_method: null,
		});
	};

	const handleSubmitBooking = async () => {
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
			{ field: "payment_method", name: "Payment Method" },
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
				showToast("Booked successfully!", "success");
				localStorage.removeItem("bookingState");
				setStep(4); // Confirmation step
			}
		} catch (error) {
			console.error("Error creating appointment:", error);
			showToast(
				error.response?.data?.message || "Booking failed. Please try again.",
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
					<div className='container mx-auto py-10 px-4 md:px-0'>
						<BookingService
							handleSetStep={handleSetStep}
							setSelectedServiceId={handleSelectService}
							storeId={selectedStoreId}
						/>
					</div>
				);
			case 2:
				return (
					<div className='container mx-auto py-10 px-4 md:px-0'>
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
					<div className='container mx-auto py-10 px-4 md:px-0 max-w-3xl'>
						<div className='bg-white shadow-md rounded-lg p-8'>
							<h2 className='text-2xl font-serif text-gray-800 mb-6 text-center'>
								Select Payment Method
							</h2>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<button
									className='px-6 py-3 bg-[#435D63] text-white font-medium rounded hover:bg-[#364a4f] transition duration-300 shadow-sm'
									onClick={() => handleSelectPaymentMethod("VNPay")}>
									Pay with VNPay
								</button>
								<button
									className='px-6 py-3 bg-white border border-[#435D63] text-[#435D63] font-medium rounded hover:bg-gray-50 transition duration-300'
									onClick={() => handleSelectPaymentMethod("Cash")}>
									Pay with Cash
								</button>
							</div>
						</div>
					</div>
				);
			case 4:
				return (
					<div className='container mx-auto py-16 px-4 md:px-0 max-w-3xl'>
						<div className='bg-white shadow-md rounded-lg p-8 border-t-4 border-[#435D63]'>
							<div className='w-20 h-20 bg-[#435D63]/5 border border-[#435D63]/20 rounded-full flex items-center justify-center mx-auto mb-8'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-10 w-10 text-[#435D63]'
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
							<h2 className='text-3xl font-serif text-center mb-4 text-gray-800'>
								Booking Confirmed
							</h2>
							<p className='text-lg text-center text-gray-600 mb-8'>
								Your appointment has been successfully scheduled. We've sent a
								confirmation to your email.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<button
									className='px-6 py-3 bg-[#435D63] text-white font-medium rounded hover:bg-[#364a4f] transition duration-300 shadow-sm'
									onClick={() => navigate(paths.profileBooking)}>
									View My Appointments
								</button>
								<button
									className='px-6 py-3 bg-white border border-[#435D63] text-[#435D63] font-medium rounded hover:bg-gray-50 transition duration-300'
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

	const stepLabels = [
		"Select Store",
		"Choose Service",
		"Schedule Appointment",
		"Payment Method",
	];

	return (
		<Suspense
			fallback={
				<Loading
					size='h-16 w-16'
					customStyle='w-full h-screen flex flex-col items-center justify-center'
					hasLoadingText
				/>
			}>
			<Banner
				imageBanner={BookingImageBanner}
				titleBanner='Book Your Appointment'
				pathBanner='Booking'
			/>

			{step < 4 && (
				<div className='container mx-auto max-w-3xl px-4 -mt-8 relative z-20 mb-12'>
					<div className='bg-white rounded-xl shadow-md px-6 py-8'>
						<div className='flex justify-between items-center'>
							{stepLabels.map((label, idx) => (
								<div
									key={idx}
									className={`flex flex-col items-center justify-center relative ${
										idx <= step ? "text-[#435D63] font-medium" : "text-gray-400"
									} ${
										idx < step
											? "cursor-pointer hover:text-[#5d7a80]"
											: "cursor-default"
									}`}
									onClick={() => idx < step && handleSetStep(idx)}>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
											idx < step
												? "bg-[#435D63] text-white"
												: idx === step
												? "border-2 border-[#435D63] text-[#435D63]"
												: "border-2 border-gray-300 text-gray-400"
										}`}>
										{idx < step ? (
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-5 w-5'
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
										) : (
											idx + 1
										)}
									</div>
									<span className='text-sm block text-center'>{label}</span>
								</div>
							))}
						</div>

						{/* Progress line */}
						<div className='flex w-full mt-4 mb-2'>
							<div
								className={`h-1 flex-1 rounded-full ${
									step >= 1 ? "bg-[#435D63]" : "bg-gray-200"
								}`}></div>
							<div className='w-10'></div>
							<div
								className={`h-1 flex-1 rounded-full ${
									step >= 2 ? "bg-[#435D63]" : "bg-gray-200"
								}`}></div>
							<div className='w-10'></div>
							<div
								className={`h-1 flex-1 rounded-full ${
									step >= 3 ? "bg-[#435D63]" : "bg-gray-200"
								}`}></div>
						</div>
					</div>
				</div>
			)}

			{renderBookingStep()}
		</Suspense>
	);
};

export default Booking;
