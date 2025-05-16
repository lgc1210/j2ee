import React, { lazy, Suspense, useState, useCallback, useEffect } from "react";
import StoreService from "../../Services/store";

const BookingHeader = lazy(() => import("../../Components/BookingHeader"));
const StoresChoosing = lazy(() => import("../../Components/StoresChoosing"));
const Pagination = lazy(() => import("../../Components/Pagination"));
const Loading = lazy(() => import("../Loading"));

const StoresChoosingWrap = ({ handleSelectStore }) => {
	const [storeList, setStoreList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedService, setSelectedService] = useState("");

	const PAGE_SIZE = 9;

	const fetchStoreList = useCallback(
		async (page) => {
			try {
				setLoading(true);
				const response = await StoreService.getAll({
					page: page - 1,
					pageSize: PAGE_SIZE,
					service: selectedService || undefined,
				});
				if (response.status === 200) {
					const { stores, totalPages } = response?.data;
					setStoreList(stores);
					setTotalPages(totalPages || 1);
				}
			} catch (error) {
				console.error("Error fetching stores", error);
			} finally {
				setLoading(false);
			}
		},
		[selectedService]
	);

	useEffect(() => {
		fetchStoreList(currentPage);
	}, [fetchStoreList, currentPage]);

	const handlePageChange = useCallback(
		(page) => {
			if (page !== currentPage) {
				setCurrentPage(page);
			}
		},
		[currentPage]
	);

	return (
		<Suspense
			fallback={
				<Loading
					size='h-16 w-16'
					customStyle='w-full h-screen flex flex-col items-center justify-center'
					hasLoadingText
				/>
			}>
			<section className='bg-gray-50 min-h-screen'>
				<BookingHeader
					selectedService={selectedService}
					setSelectedService={setSelectedService}
				/>

				<div className='container mx-auto py-12 px-4 md:px-6 lg:px-8'>
					<div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-10'>
						<h1 className='font-serif text-2xl md:text-3xl text-gray-800 font-light mb-4 md:mb-0'>
							Find a store for your service
						</h1>

						<div className='inline-flex items-center text-sm text-gray-500'>
							<span className='mr-2'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-5 w-5 text-[#435D63]'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={1.5}
										d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
							</span>
							Showing {storeList?.length} of {totalPages * PAGE_SIZE} stores
						</div>
					</div>

					{loading ? (
						<div className='flex justify-center py-20'>
							<Loading size='h-12 w-12' customStyle='flex justify-center' />
						</div>
					) : (
						<>
							<StoresChoosing
								onClick={handleSelectStore}
								storeList={storeList}
							/>

							{/* Pagination and support */}
							<div className='flex flex-col md:flex-row items-center justify-between gap-6 mt-10'>
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
								/>

								<div className='flex items-center space-x-2 text-sm'>
									<span className='text-gray-600'>Questions?</span>
									<a
										href='mailto:support@gmail.com'
										className='font-medium text-[#435D63] hover:text-[#2c3e42] transition-colors'>
										support@gmail.com
									</a>
								</div>
							</div>
						</>
					)}
				</div>
			</section>
		</Suspense>
	);
};

export default React.memo(StoresChoosingWrap);
