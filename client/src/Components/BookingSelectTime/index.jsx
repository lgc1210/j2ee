import React from "react";

const BookingSelectTime = ({
	timeSlots,
	selectedTimeSlot,
	onSelectTimeSlot,
	isLoading,
}) => {
	// Format time for display (e.g., "14:30:00" to "2:30 PM")
	const formatTime = (timeString) => {
		if (!timeString) return "";
		const [hours, minutes] = timeString.split(":");
		const hour = parseInt(hours, 10);
		const ampm = hour >= 12 ? "PM" : "AM";
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${ampm}`;
	};

	return (
		<div className='bg-white rounded-lg p-4 shadow-sm mb-6'>
			<div className='flex items-center mb-4'>
				<svg
					className='w-5 h-5 text-[#435D63] mr-2'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'>
					<circle cx='12' cy='12' r='10'></circle>
					<polyline points='12 6 12 12 16 14'></polyline>
				</svg>
				<span className='font-medium'>Available Times</span>
			</div>

			{isLoading ? (
				<div className='flex justify-center py-4'>
					<div className='animate-pulse flex space-x-2'>
						<div className='rounded-full bg-gray-200 h-2 w-2'></div>
						<div className='rounded-full bg-gray-300 h-2 w-2'></div>
						<div className='rounded-full bg-gray-200 h-2 w-2'></div>
					</div>
				</div>
			) : !timeSlots || timeSlots.length === 0 ? (
				<div className='text-center py-4 text-gray-500 italic'>
					No time slots available for this date
				</div>
			) : (
				<div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
					{timeSlots.map((slot, index) => {
						const isSelected =
							selectedTimeSlot &&
							selectedTimeSlot.startTime === slot.startTime &&
							selectedTimeSlot.endTime === slot.endTime;

						return (
							<button
								key={index}
								onClick={() => onSelectTimeSlot(slot)}
								className={`
                  text-sm py-2 px-1 rounded transition-all duration-200
                  ${
										isSelected
											? "bg-[#435D63] text-white ring-2 ring-[#435D63]/20"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}
                `}>
								{formatTime(slot.startTime.split(":").slice(0, 2).join(":"))}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default React.memo(BookingSelectTime);
