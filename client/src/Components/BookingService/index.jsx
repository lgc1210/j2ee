import React from "react";

const BookingServiceList = React.lazy(() => import("./BookingServiceList"));

const BookingService = ({ storeId, setSelectedServiceId }) => {
	const [localSelectedServiceId, setLocalSelectedServiceId] =
		React.useState(null);

	const handleServiceSelection = (serviceId) => {
		setLocalSelectedServiceId(serviceId);
		setSelectedServiceId(serviceId);
	};

	return (
		<section className='md:py-36 py-28 md:px-0 px-6'>
			<div className='container mx-auto'>
				<div className='flex flex-col items-center gap-8 relative z-10'>
					<p className='text-[#799aa1] font-sans text-xl text-center uppercase tracking-widest'>
						Services
					</p>
					<p className='lg:text-7xl text-3xl font-serif text-center 2xl:w-1/2 w-full'>
						We provide services
					</p>
					<p className='font-sans text-lg text-center 2xl:w-1/2 w-full'>
						Enhancing your beauty with expert care, innovative treatments, and
						personalized solutions for lasting radiance.
					</p>
					<p className='absolute top-0 right-0 left-0 text-center -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
						Services
					</p>
				</div>

				<div className='mt-20'>
					<BookingServiceList
						storeId={storeId}
						selectedServiceId={localSelectedServiceId}
						setSelectedServiceId={handleServiceSelection}
					/>
				</div>
			</div>
		</section>
	);
};

export default BookingService;
