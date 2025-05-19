import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

const FilterProduct = () => {
	const [productCategoryList, setProductCategoryList] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// Mock fetch (replace with your API call)
				setProductCategoryList(["Face", "Organic"]);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div className='bg-white p-6 rounded-lg shadow-lg'>
			<div className='relative'>
				<input
					type='text'
					placeholder='Search products...'
					className='w-full py-2 pr-10 bg-transparent border-b border-gray-300 focus:outline-none focus:border-[#435D63] text-lg'
				/>
				<IoSearch
					className='absolute right-2 top-2.5 text-gray-400'
					size={24}
				/>
			</div>
			<div className='mt-8'>
				<h3 className='text-xl font-semibold text-gray-700'>Category</h3>
				<div className='mt-2 border-b-2 border-[#435D63] w-12'></div>
				{loading ? (
					<p className='text-gray-500 mt-4'>Loading...</p>
				) : (
					<ul className='mt-6 space-y-3'>
						{productCategoryList.map((category, index) => (
							<li key={index}>
								<button className='text-lg text-gray-700 hover:text-[#435D63] transition-colors duration-300'>
									{category}{" "}
									<span className='text-gray-400'>({index + 4})</span>
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default React.memo(FilterProduct);
