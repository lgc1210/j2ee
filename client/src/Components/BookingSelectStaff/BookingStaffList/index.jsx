import React from "react";
import BookingStaffItem from "../BookingStaffItem";

const BookingStaffList = ({
	availableStaff,
	selectedTimeSlot,
	onSelectTimeSlot,
}) => {
	return (
		<ul className='flex items-start md:justify-start justify-center flex-wrap gap-2'>
			{availableStaff.map((staffAvailability, index) => (
				<BookingStaffItem
					key={staffAvailability.staff_id || index}
					staff={staffAvailability} // Pass the entire staffAvailability object
					timeSlots={staffAvailability.availableTimeSlots} // Use availableTimeSlots
					selectedTimeSlot={selectedTimeSlot}
					onSelectTimeSlot={onSelectTimeSlot}
				/>
			))}
		</ul>
	);
};

export default React.memo(BookingStaffList);
