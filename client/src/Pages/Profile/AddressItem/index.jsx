import React from "react";

const AddressItem = ({
	item,
	handleClickedUpdate,
	setShowConfirmPopup,
	handleSetDefault,
}) => {
	if (!item) return null;

	return (
		<li className='flex items-center justify-between py-4 border-t border-black/10'>
			<div>
				<span className='flex items-center justify-start'>
					<p className='font-semibold'>{item?.name}</p>
					{/* Divider */}
					<span className='mx-2 w-[1px] h-6 bg-black/10'></span>
					<p className='text-black/60 text-sm'>{item?.phone}</p>
				</span>
				<div>
					<p className='text-black/60 text-sm'>{item?.address}</p>
				</div>
				{item?.is_default && (
					<span className='text-xs text-[#435d63] border border-[#435d63] px-1 rounded'>
						Default
					</span>
				)}
			</div>
			<div className='flex flex-col items-end gap-4'>
				<span className='flex items-center gap-2'>
					<button
						className='text-sm cursor-pointer text-[#435d63] hover:underline'
						onClick={() => handleClickedUpdate(item)}>
						Update
					</button>
					{!item?.is_default && (
						<button
							className='text-sm cursor-pointer text-[#435d63] hover:underline'
							onClick={() =>
								setShowConfirmPopup((prev) => ({
									...prev,
									addressId: item?.id,
									isShow: true,
								}))
							}>
							Delete
						</button>
					)}
				</span>
				{!item?.is_default && (
					<button
						className='text-sm cursor-pointer border border-black/20 py-0.5 px-4 rounded hover:bg-gray-300/15'
						onClick={() => handleSetDefault(item?.id)}>
						Set default
					</button>
				)}
			</div>
		</li>
	);
};

export default React.memo(AddressItem);
