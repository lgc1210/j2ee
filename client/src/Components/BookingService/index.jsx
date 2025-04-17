import React from "react";
import { showToast } from "../Toast";
import { FaArrowRightLong } from "react-icons/fa6";
import ServiceService from "../../Services/service";

const Button = React.lazy(() => import("../Button"));
const BookingServiceList = React.lazy(() => import("./BookingServiceList"));

const BookingService = ({ storeId, handleSetStep }) => {
	const [services, setServices] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	console.log("Service list: ", services);

	const fetchServices = React.useCallback(async () => {
		try {
			setLoading(true);
			const response = await ServiceService.getAllByStoreId(storeId);
			if (response.status === 200) {
				setServices(response?.data);
			}
		} catch (error) {
			showToast(
				"There's something wrong while fetching services of the store",
				"error"
			);
		} finally {
			setLoading(false);
		}
	}, [storeId]);

	// React.useEffect(() => {
	// 	fetchServices();
	// }, [fetchServices]);

	return (
		<section className='md:py-36 py-28 md:px-0 px-6'>
			<div className='container mx-auto '>
				{/* Header */}
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

				{/* Service list */}
				<BookingServiceList serviceList={services} />

				{/* Confirm */}
				<div className='mt-20'>
					<Button
						text='Next'
						Icon={FaArrowRightLong}
						iconSize={14}
						buttonStyle='justify-center gap-2 mt-10 mx-auto lg:[&]:py-6 lg:[&]:px-16 lg:[&]:text-lg'
						iconStyle=''
						onClick={() => handleSetStep(2)}
					/>
				</div>
			</div>
		</section>
	);
};

export default BookingService;
