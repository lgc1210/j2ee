import React from "react";
import BookingServiceItem from "../BookingServiceItem";
import ServiceService from "../../../Services/service";

const BookingServiceList = ({
	selectedServiceId,
	setSelectedServiceId,
	storeId,
}) => {
	const [services, setServices] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [totalElements, setTotalElements] = React.useState(1);

	const fetchServices = React.useCallback(async () => {
		try {
			setLoading(true);
			const response = await ServiceService.getAllByStoreId(storeId);
			if (response.status === 200) {
				const { services, totalElements } = response?.data;
				setServices(services || []);
				setTotalElements(totalElements);
			}
		} catch (error) {
			console.log("Error fetching services", error);
			setServices([]);
		} finally {
			setLoading(false);
		}
	}, [storeId]);

	React.useEffect(() => {
		storeId && fetchServices();
	}, [fetchServices, storeId]);

	if (loading) {
		return (
			<div className='flex justify-center items-center py-20'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#435D63]'></div>
			</div>
		);
	}

	if (services.length === 0) {
		return (
			<div className='text-center py-10'>
				<p className='text-gray-500'>No services available for this store.</p>
			</div>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{services?.map((service, index) => (
				<BookingServiceItem
					key={service.id}
					item={service}
					no={index}
					totalElements={totalElements}
					selectedServiceId={selectedServiceId}
					setSelectedServiceId={setSelectedServiceId}
				/>
			))}
		</div>
	);
};

export default BookingServiceList;
