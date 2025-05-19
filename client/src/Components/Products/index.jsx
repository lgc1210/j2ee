import React from "react";
import Product from "../Product";

const Products = ({ productList }) => {
	return (
		<ul className='grid lg:grid-cols-3 md:grid-cols-2 gap-6'>
			{productList.length > 0 ? (
				productList.map((product) => (
					<Product key={product?.id} product={product} />
				))
			) : (
				<li className='col-span-full text-center text-gray-600'>
					No products available.
				</li>
			)}
		</ul>
	);
};

export default React.memo(Products);
