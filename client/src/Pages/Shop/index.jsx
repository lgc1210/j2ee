import { lazy, Suspense, useEffect } from "react";
import { useProduct } from "../../Contexts/Product";
import ShopImageBanner from "../../assets/images/banner/uby-yanes-0ABufdkXgPI-unsplash-900x900.jpg";

const FilterProduct = lazy(() => import("../../Components/FilterProduct"));
const ProductList = lazy(() => import("../../Components/ProductList"));
const Loading = lazy(() => import("../../Components/Loading"));
const StoresChoosingWrap = lazy(() =>
	import("../../Components/StoresChoosingWrap")
);
const Banner = lazy(() => import("../../Components/Banner"));

const Shop = () => {
	const { selectedStoreId, setSelectedStoreId } = useProduct();

	useEffect(() => {
		setSelectedStoreId(null);
	}, [setSelectedStoreId]);

	const handleSelectStore = (storeId) => {
		setSelectedStoreId(storeId);
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
				<Banner
					imageBanner={ShopImageBanner}
					titleBanner='Shop'
					pathBanner='Shop'
				/>
				{selectedStoreId ? (
					<div className='py-20 px-6'>
						<div className='container mx-auto'>
							<div className='grid md:grid-cols-4 gap-8'>
								<div className='md:col-span-1'>
									<FilterProduct />
								</div>
								<div className='md:col-span-3'>
									<ProductList />
								</div>
							</div>
						</div>
					</div>
				) : (
					<StoresChoosingWrap handleSelectStore={handleSelectStore} />
				)}
			</section>
		</Suspense>
	);
};

export default Shop;
