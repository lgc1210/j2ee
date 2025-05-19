import React, { lazy, memo, Suspense } from "react";
import { BsCartPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";
import { useCart } from "../../Contexts/Cart";
import { toVND } from "../../Utils/vietnamCurrency";
import { showToast } from "../Toast";

const Loading = lazy(() => import("../Loading"));

const Product = ({ product }) => {
	const navigate = useNavigate();
	const { handleChangeQuantity } = useCart();

	const handleNavigateToProductDetails = (productId, event) => {
		event.stopPropagation();
		navigate(`${paths.productDetails.replace(":id", productId)}`, {
			state: { productId },
		});
	};

	const handleAddToCart = async (event, productId) => {
		event.stopPropagation();
		await handleChangeQuantity(productId, 1);
		showToast("Added");
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
			<li key={product?.id}>
				<div
					className='group relative cursor-pointer mb-6 rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300'
					onClick={(event) =>
						handleNavigateToProductDetails(product?.id, event)
					}>
					<img
						src={
							product?.image ||
							"https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod1-800x800.jpg"
						}
						alt={product?.name}
						className='w-full h-64 object-cover object-center transition-transform duration-300 group-hover:scale-105'
					/>

					{/* Sale Badge */}
					{product?._sale && (
						<div className='absolute top-4 left-4'>
							<span className='inline-block bg-[#435D63] text-white text-sm px-3 py-0.5 rounded-full'>
								Sale!
							</span>
						</div>
					)}

					{/* Add to Cart Button */}
					<button
						className='absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 group-hover:-translate-y-1/2 opacity-0 group-hover:opacity-100 bg-[#435D63] p-3 rounded-full transition-all duration-300'
						onClick={(event) => handleAddToCart(event, product?.id)}>
						<BsCartPlus size={24} className='text-white' />
					</button>
				</div>

				<div className='text-center'>
					<h3
						className='text-xl font-semibold text-gray-800 hover:text-[#435D63] transition-colors duration-300 cursor-pointer'
						onClick={(event) =>
							handleNavigateToProductDetails(product?.id, event)
						}>
						{product?.name || "Unnamed Product"}
					</h3>
					<div className='flex items-center justify-center gap-2 mt-2'>
						{product?.old_price && (
							<span className='text-gray-400 line-through font-medium'>
								{toVND(product?.old_price)}
							</span>
						)}
						<span className='text-gray-800 text-xl font-semibold'>
							{toVND(product?.price) || "0.00"}
						</span>
					</div>
				</div>
			</li>
		</Suspense>
	);
};

export default memo(Product);
