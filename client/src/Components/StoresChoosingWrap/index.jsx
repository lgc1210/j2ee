import React, { lazy, Suspense } from "react";

const BookingHeader = lazy(() => import("../../Components/BookingHeader"));
const StoresChossing = lazy(() => import("../../Components/StoresChoosing"));
const Pagination = lazy(() => import("../../Components/Pagination"));
const Loading = lazy(() => import("../Loading"));

const StoresChoosingWrap = ({ handleSelectStore }) => {
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
					<StoresChossing onClick={handleSelectStore} />
					<div className='flex items-center justify-between mt-6'>
						<Pagination />
						<p className='font-sans text-xl'>
							For any questions, please reach out to{" "}
							<span>
								<a
									href='mailto:support@gmail.com'
									className='font-bold text-[#779AA1]'>
									support@gmail.com
								</a>
							</span>
						</p>
					</div>
				</div>
			</section>
		</Suspense>
	);
};

export default React.memo(StoresChoosingWrap);
