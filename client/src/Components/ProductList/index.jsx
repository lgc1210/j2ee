import React, { lazy, Suspense } from "react";
import { useProduct } from "../../Contexts/Product";
import { FaAngleDown } from "react-icons/fa6";

const SortingProduct = lazy(() => import("../SortingProduct"));
const Loading = lazy(() => import("../Loading"));
const Products = lazy(() => import("../Products"));

const ProductList = () => {
	const { hasMore, setPage, productList } = useProduct();

	const handleShowMore = () => {
		if (hasMore) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	console.log("Product list: ", productList);

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
				<div className='mb-8'>
					<SortingProduct productList={productList} />
				</div>
				<div>
					<Products productList={productList} />
					{hasMore && (
						<button
							onClick={handleShowMore}
							className='mt-10 mx-auto flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300'>
							Show More <FaAngleDown size={14} />
						</button>
					)}
				</div>
			</section>
		</Suspense>
	);
};

export default React.memo(ProductList);
