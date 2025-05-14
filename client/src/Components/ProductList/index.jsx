import React, { lazy, Suspense } from "react";
import { useProduct } from "../../Contexts/Product";
import Button from "../Button";
import { FaAngleDown } from "react-icons/fa6";

const SortingProduct = lazy(() => import("../SortingProduct"));
const Loading = lazy(() => import("../../Components/Loading"));
const Products = lazy(() => import("../Products"));

const ProductList = () => {
	const { hasMore, setPage } = useProduct();

	const handleShowMore = () => {
		if (hasMore) {
			setPage((prevPage) => prevPage + 1);
		}
	};

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
					<SortingProduct />
				</div>
				<div>
					<Products />
					{hasMore && (
						<div className='mt-20'>
							<Button
								text='Show More'
								Icon={FaAngleDown}
								iconSize={14}
								textStyle='!text-sm'
								buttonStyle={`flex-col justify-center gap-1 hover:gap-2.5 mt-10 mx-auto lg:[&]:py-2 lg:[&]:px-8 lg:[&]:text-lg`}
								onClick={handleShowMore}
							/>
						</div>
					)}
				</div>
			</section>
		</Suspense>
	);
};

export default React.memo(ProductList);
