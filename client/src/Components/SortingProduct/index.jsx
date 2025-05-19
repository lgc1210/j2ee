import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const SortingProduct = ({ productList }) => {
	const [showSortType, setShowSortType] = useState(false);
	const [type, setType] = useState("Default sorting");

	const toggle = () => setShowSortType(!showSortType);

	const sortOptions = [
		"Price Ascending",
		"Price Descending",
		"Name Ascending",
		"Name Descending",
	];

	return (
		<div className='flex items-center justify-between'>
			<p className='text-gray-600'>Showing all {productList.length} results</p>
			<div className='relative'>
				<button
					onClick={toggle}
					className='flex items-center gap-2 text-gray-700 hover:text-[#435D63] transition-colors duration-300'>
					<span>{type}</span>
					<IoIosArrowDown size={16} />
				</button>
				{showSortType && (
					<ul className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10'>
						{sortOptions.map((option) => (
							<li
								key={option}
								onClick={() => {
									setType(option);
									toggle();
								}}
								className='px-4 py-2 text-sm hover:bg-[#435D63]/10 cursor-pointer'>
								{option}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default SortingProduct;
