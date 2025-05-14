import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useProduct } from "../../Contexts/Product";

const SortingProduct = () => {
	const { productList } = useProduct();

	return (
		<div className='flex items-center justify-between'>
			<div className=''>
				<p className='text-zinc-500 text-md font-sans'>
					Showing all {productList.length} results
				</p>
			</div>
			<div className='cursor-pointer flex items-center gap-2'>
				<p className='text-md text-zinc-700'>Default sorting</p>
				<IoIosArrowDown size={16} className='h-full' />
			</div>
		</div>
	);
};

export default SortingProduct;
