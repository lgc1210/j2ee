import React from "react";
import BookingStaffItem from "./BookingStaffItem";

const BookingSelectStaff = ({
	availableStaff,
	selectedStaffId,
	onSelectStaff,
}) => {
	return (
		<section className='mt-10 flex-grow'>
			<h3 className='text-2xl font-serif mb-6 text-center'>Available Staff</h3>
			{!availableStaff || availableStaff.length === 0 ? (
				<p className='text-lg font-sans text-center'>
					No staff available for the selected time slot.
				</p>
			) : (
				<ul className='flex item-center justify-start gap-4'>
					{availableStaff.map((staff) => (
						<BookingStaffItem
							key={staff.staff_id}
							staff={staff}
							isSelected={selectedStaffId === staff.staff_id}
							onSelect={() => onSelectStaff(staff.staff_id)}
						/>
					))}
				</ul>
			)}
		</section>
	);
};

export default React.memo(BookingSelectStaff);
