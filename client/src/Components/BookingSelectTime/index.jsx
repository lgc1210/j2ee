import React from "react";
import BookingTimeItem from "./BookingTimeItem";

const BookingSelectTime = ({
	timeSlots,
	selectedTimeSlot,
	onSelectTimeSlot,
}) => {
	return (
		<section className='mt-10 flex-grow'>
			<h3 className='text-2xl font-serif mb-6 text-center'>Available Times</h3>
			{!timeSlots || timeSlots.length === 0 ? (
				<p className='text-lg font-sans text-center'>
					No available time slots for the selected date.
				</p>
			) : (
				<ul className='flex items-start md:justify-start justify-center flex-wrap gap-2'>
					{timeSlots.map((slot, index) => (
						<BookingTimeItem
							key={index}
							item={slot}
							isSelected={
								selectedTimeSlot &&
								selectedTimeSlot.startTime === slot.startTime &&
								selectedTimeSlot.endTime === slot.endTime
							}
							onSelect={() => onSelectTimeSlot(slot)}
						/>
					))}
				</ul>
			)}
		</section>
	);
};

export default React.memo(BookingSelectTime);
