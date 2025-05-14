import React from "react";
import BookingServiceItem from "../BookingServiceItem";
import ServiceService from "../../../Services/service";
import { showToast } from "../../Toast";

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
				setServices(services);
				setTotalElements(totalElements);
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

	React.useEffect(() => {
		if (storeId) {
			fetchServices();
		}
	}, [fetchServices, storeId]);

	return (
		<ul className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-flow-row gap-4'>
			{services?.map((service, index) => (
				<BookingServiceItem
					key={service?.id}
					item={service}
					no={index}
					totalElements={totalElements}
					selectedServiceId={selectedServiceId}
					setSelectedServiceId={setSelectedServiceId}
				/>
			))}
		</ul>
	);
};

export default BookingServiceList;
