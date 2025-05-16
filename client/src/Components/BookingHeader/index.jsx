import React from "react";

const FormControl = React.lazy(() => import("../FormControl"));

const BookingHeader = ({ selectedService, setSelectedService }) => {
	return (
		<header className='bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between h-16 md:h-20'>
					<div className='flex items-center space-x-1'>
						<div className='w-2 h-8 bg-[#435D63] rounded-full'></div>
						<h2 className='text-lg text-gray-800 font-serif ml-2'>
							Our Locations
						</h2>
					</div>

					<div className='flex items-center space-x-2'>
						<div className='relative'>
							<select
								className='appearance-none bg-transparent border border-gray-200 rounded-full pl-4 pr-10 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#435D63]/20 focus:border-[#435D63] cursor-pointer transition-all duration-200 min-w-[180px]'
								value={selectedService}
								onChange={(e) => setSelectedService(e.target.value)}>
								<option value=''>All Services</option>
								<option value='haircut'>Hair Cut</option>
								<option value='spa'>Spa Treatment</option>
								<option value='nail'>Nail Service</option>
								<option value='facial'>Facial Care</option>
								<option value='massage'>Massage</option>
							</select>
							<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500'>
								<svg
									className='w-4 h-4'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 9l-7 7-7-7'
									/>
								</svg>
							</div>
						</div>

						<button className='bg-[#435D63] hover:bg-[#364a4f] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200 hidden md:flex items-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4 mr-1'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
								/>
							</svg>
							Filter
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default React.memo(BookingHeader);
