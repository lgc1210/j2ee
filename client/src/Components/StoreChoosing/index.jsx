import React from "react";
import Store1 from "../../assets/images/services/delfina-pan-scaled-900x1350.jpeg";

const StoreChoosing = ({ store, onClick }) => {
	return (
		<li>
			<div
				className='group'
				onClick={() => {
					store?.id !== undefined && store?.id !== null && onClick(store?.id);
				}}>
				<div className='w-full h-full max-h-72 overflow-hidden relative shadow-lg group-hover:shadow-none transition-all duration-700'>
					<img
						src={Store1}
						alt={store?.name}
						className='transition-all duration-700 group-hover:scale-[1.15] w-full h-full object-center object-cover'
					/>
					<div className='absolute left-0 bottom-0'>
						<p className='font-sans font-semibold text-2xl p-4 text-amber-500 tracking-wider leading-none '>
							{store?.name}
						</p>
					</div>
					<div className='absolute left-0 top-0 mt-2'>
						<button className='shadow-md font-sans font-semibold text-lg py-1 px-1.5 text-white bg-[#779AA1] rounded-tr-md rounded-br-md'>
							Shop now
						</button>
					</div>
				</div>
			</div>
		</li>
	);
};

export default React.memo(StoreChoosing);
