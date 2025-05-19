import { toVND } from "../../../Utils/vietnamCurrency";

const BookingServiceItem = ({
	item,
	no,
	totalElements,
	selectedServiceId,
	setSelectedServiceId,
}) => {
	const isSelected = selectedServiceId === item?.id;

	return (
		<div
			className={`
        bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300
        border overflow-hidden cursor-pointer 
        ${
					isSelected
						? "border-[#435D63] ring-2 ring-[#435D63]/20"
						: "border-gray-100"
				}
      `}
			onClick={() => setSelectedServiceId(item?.id, item?.price)} // Pass both id and price
		>
			<div className='relative'>
				{item?.imageBase64 ? (
					<img
						src={item?.imageBase64}
						alt={item.name}
						className='w-full h-48 object-cover'
					/>
				) : (
					<div className='w-full h-48 bg-gray-100 flex items-center justify-center'>
						<svg
							className='w-12 h-12 text-gray-300'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1}
								d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
							/>
						</svg>
					</div>
				)}
				<span className='absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full'>
					{no + 1}/{totalElements}
				</span>
				{isSelected && (
					<div className='absolute top-3 right-3 bg-[#435D63] text-white rounded-full p-1'>
						<svg
							className='w-4 h-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M5 13l4 4L19 7'
							/>
						</svg>
					</div>
				)}
			</div>

			<div className='p-5'>
				<div className='flex justify-between items-start mb-3'>
					<h3 className='font-serif text-lg font-medium text-gray-800'>
						{item?.name}
					</h3>
					{item?.price && (
						<span className='font-medium text-[#435D63]'>
							{toVND(item.price)}
						</span>
					)}
				</div>

				<p className='text-gray-600 text-sm leading-relaxed line-clamp-3'>
					{item?.description}
				</p>

				{item?.duration && (
					<div className='mt-4 flex items-center text-gray-500 text-xs'>
						<svg
							className='w-4 h-4 mr-1'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						<span>{item.duration} min</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default BookingServiceItem;
