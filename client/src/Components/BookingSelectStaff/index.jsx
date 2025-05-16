import React from "react";

const BookingSelectStaff = ({
	availableStaff,
	selectedStaffId,
	onSelectStaff,
	isLoading,
}) => {
	console.log(availableStaff);
	return (
		<div className='bg-white rounded-lg p-4 shadow-sm'>
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
					<path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
					<circle cx='12' cy='7' r='4'></circle>
				</svg>
				<span className='font-medium'>Choose Specialist</span>
			</div>

			{isLoading ? (
				<div className='flex justify-center py-4'>
					<div className='animate-pulse flex space-x-2'>
						<div className='rounded-full bg-gray-200 h-2 w-2'></div>
						<div className='rounded-full bg-gray-300 h-2 w-2'></div>
						<div className='rounded-full bg-gray-200 h-2 w-2'></div>
					</div>
				</div>
			) : !availableStaff || availableStaff.length === 0 ? (
				<div className='text-center py-4 text-gray-500 italic'>
					No specialists available for this time slot
				</div>
			) : (
				<div className='grid grid-cols-2 gap-3'>
					{availableStaff.map((staff) => {
						const isSelected = selectedStaffId === staff.staff_id;

						return (
							<button
								key={staff.staff_id}
								onClick={() => onSelectStaff(staff.staff_id)}
								className={`flex flex-col items-center p-3 border rounded-lg transition-all duration-200
                  					${
															isSelected
																? "border-[#435D63] bg-[#435D63]/5 ring-2 ring-[#435D63]/10"
																: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
														}`}>
								<div className='w-16 h-16 rounded-full mb-2 overflow-hidden bg-gray-100 flex items-center justify-center'>
									{staff.image_url ? (
										<img
											src={staff.image_url}
											alt={staff.name}
											className='w-full h-full object-cover'
										/>
									) : (
										<svg
											className='w-8 h-8 text-gray-400'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'>
											<path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path>
											<circle cx='12' cy='7' r='4'></circle>
										</svg>
									)}
								</div>
								<span className='font-medium text-gray-800'>
									{staff.staff_name}
								</span>
								{staff.role && (
									<span className='text-xs text-gray-500 mt-1'>
										{staff.role}
									</span>
								)}
								{isSelected && (
									<div className='mt-2 flex items-center justify-center bg-[#435D63] text-white px-2 py-1 rounded-full text-xs'>
										Selected
									</div>
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default React.memo(BookingSelectStaff);
