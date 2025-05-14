import React, { lazy, Suspense, useState, useCallback, useEffect } from "react";
import StoreService from "../../Services/store";

const BookingHeader = lazy(() => import("../../Components/BookingHeader"));
const StoresChoosing = lazy(() => import("../../Components/StoresChoosing"));
const Pagination = lazy(() => import("../../Components/Pagination"));
const Loading = lazy(() => import("../Loading"));

const StoresChoosingWrap = ({ handleSelectStore }) => {
	const [storeList, setStoreList] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchStoreList = useCallback(async () => {
		try {
			setLoading(true);
			const response = await StoreService.getAll();
			if (response.status === 200) {
				setStoreList(response?.data?.stores);
			}
		} catch (error) {
			console.error("Error fetching stores", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStoreList();
	}, [fetchStoreList]);

	return (
		<Suspense
			fallback={
				<Loading
					size='h-16 w-16'
					customStyle='w-full h-screen flex flex-col items-center justify-center'
					hasLoadingText
				/>
			}>
			<section>
				<BookingHeader />
				<div className='container mx-auto py-20 md:px-0 px-6'>
					<p className='mb-10 font-serif text-2xl'>
						Find a store for your service
					</p>
					<StoresChoosing onClick={handleSelectStore} storeList={storeList} />
					<div className='flex items-center justify-between mt-6'>
						<Pagination />
						<p className='font-sans text-xl'>
							For any questions, please reach out to{" "}
							<a
								href='mailto:support@gmail.com'
								className='font-bold text-[#779AA1]'>
								support@gmail.com
							</a>
						</p>
					</div>
				</div>
			</section>
		</Suspense>
	);
};

export default React.memo(StoresChoosingWrap);
