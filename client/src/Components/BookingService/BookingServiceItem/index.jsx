import React from "react";

const BookingServiceItem = ({
	item,
	no,
	totalElements,
	selectedServiceId,
	setSelectedServiceId,
}) => {
	return (
		<li key={item?.id}>
			<div
				className={`w-full h-full max-h-72 p-4 rounded-xl border-2 flex flex-col gap-2 cursor-pointer hover:shadow hover:border-[#799AA1] ${
					selectedServiceId === item?.id ? "border-[#799AA1]" : ""
				}`}
				onClick={() => setSelectedServiceId(item?.id)}>
				<p>
					{no + 1}/{totalElements}
				</p>
				<span className='flex flex-col items-center justify-center gap-2'>
					<p className='text-2xl font-bold'>{item?.name}</p>
					<p className='text-black/70 text-center'>{item?.description}</p>
				</span>
			</div>
		</li>
	);
};

export default BookingServiceItem;
