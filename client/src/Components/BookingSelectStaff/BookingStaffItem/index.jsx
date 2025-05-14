import React from "react";

const BookingStaffItem = ({ staff, isSelected, onSelect }) => {
	return (
		<li>
			<div
				className={`cursor-pointer px-4 py-2 border-2 shadow-md hover:shadow-none hover:scale-[0.99] transition min-w-40 ${
					isSelected
						? "bg-[#779AA1] text-white border-[#779AA1]"
						: "text-[#779AA1] border-[#779AA1]"
				}`}
				onClick={onSelect}>
				<p className='text-center font-semibold'>{staff.staff_name}</p>
			</div>
		</li>
	);
};

export default React.memo(BookingStaffItem);
