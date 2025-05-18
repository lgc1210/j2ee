import React from "react";

const StoreChoosing = ({ store, onClick }) => {
	return (
		<div
			className='group cursor-pointer transition-all duration-300 bg-white rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1'
			onClick={() => {
				store?.id !== undefined && store?.id !== null && onClick(store?.id);
			}}>
			<div className='relative aspect-[4/3] overflow-hidden'>
				<img
					src={
						store?.imageBase64 ||
						"https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg"
					}
					alt={store?.name}
					className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
				/>
				<div className='absolute top-4 left-4'>
					<span className='inline-flex px-3 py-1 text-xs font-medium text-white bg-[#435D63] rounded-full shadow-sm'>
						Shop now
					</span>
				</div>
			</div>

			<div className='p-5'>
				<h3 className='font-sans text-lg font-medium text-gray-800 mb-1'>
					{store?.name}
				</h3>
				<div className='flex items-center space-x-1 text-[#779AA1]'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-4 w-4'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
						/>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
						/>
					</svg>
					<span className='text-sm text-gray-600'>
						{store?.address || "Location available in store details"}
					</span>
				</div>
			</div>
		</div>
	);
};

export default React.memo(StoreChoosing);
