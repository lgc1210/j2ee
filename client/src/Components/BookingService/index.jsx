import React from "react";

const BookingServiceList = React.lazy(() => import("./BookingServiceList"));

const BookingService = ({ storeId, setSelectedServiceId, handleSetStep }) => {
	const [localSelectedServiceId, setLocalSelectedServiceId] =
		React.useState(null);

	const handleServiceSelection = (serviceId) => {
		setLocalSelectedServiceId(serviceId);
		setSelectedServiceId(serviceId);
	};

	return (
		<div className='max-w-6xl mx-auto'>
			<div className='mb-10 text-center'>
				<h2 className='text-3xl font-serif mb-3 text-gray-800'>Our Services</h2>
				<div className='w-24 h-1 bg-[#435D63] mx-auto mb-6'></div>
				<p className='text-gray-600 max-w-2xl mx-auto'>
					Enhancing your beauty with expert care, innovative treatments, and
					personalized solutions for lasting radiance.
				</p>
			</div>

			<BookingServiceList
				selectedServiceId={localSelectedServiceId}
				setSelectedServiceId={handleServiceSelection}
				storeId={storeId}
			/>

			{localSelectedServiceId && (
				<div className='mt-10 flex justify-center'>
					<button
						onClick={() => handleSetStep(2)}
						className='px-8 py-3 bg-[#435D63] text-white rounded-md hover:bg-[#364a4f] transition-all duration-300 shadow-sm flex items-center'>
						Continue
						<svg
							className='w-5 h-5 ml-2'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M14 5l7 7m0 0l-7 7m7-7H3'
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
};

export default BookingService;
