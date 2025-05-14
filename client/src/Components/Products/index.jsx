import React from "react";
import Product from "../Product";
import { useProduct } from "../../Contexts/Product";

const Products = () => {
	const { productList } = useProduct();

	return (
		<ul className='grid lg:grid-cols-3 md:grid-cols-2 gap-12'>
			{productList.length > 0 ? (
				productList.map((product) => (
					<Product key={product?.id} product={product} />
				))
			) : (
				<li className='flex items-center justify-center lg:col-span-3 md:col-span-2 h-32'>
					No products available.
				</li>
			)}
		</ul>
	);
};

export default React.memo(Products);
