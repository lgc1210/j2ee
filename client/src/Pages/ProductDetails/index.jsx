import React, { useState, useRef, lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ShopImageBanner from "../../assets/images/banner/uby-yanes-0ABufdkXgPI-unsplash-900x900.jpg";
import { BsCartPlus } from "react-icons/bs";
import { useProduct } from "../../Contexts/Product";
import { useCart } from "../../Contexts/Cart";
import { toVND } from "../../Utils/vietnamCurrency";
import { showToast } from "../../Components/Toast";

const FormControl = lazy(() => import("../../Components/FormControl"));
const Button = lazy(() => import("../../Components/Button"));
const Banner = lazy(() => import("../../Components/Banner"));
const Loading = lazy(() => import("../../Components/Loading"));
const ProductDescription = lazy(() => import("./ProductDescription"));

const ProductDetails = () => {
	const productId = useLocation()?.state?.productId;
	const [quantity, setQuantity] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
	const imageRef = useRef(null);
	const [mainImage, setMainImage] = useState(
		"https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod2.jpg"
	);
	const { fetchProductDetails, productDetails } = useProduct();
	const { handleChangeQuantity } = useCart();

	useEffect(() => {
		if (productId) {
			fetchProductDetails(productId);
		}
	}, [productId, fetchProductDetails]);

	const handleMouseMove = (event) => {
		const image = imageRef.current;
		if (!image) return;

		const rect = image.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		setPosition({ x, y, scale: 1.5 });
	};

	const handleMouseLeave = () => {
		setPosition({ x: 0, y: 0, scale: 1 });
	};

	const changeQuantity = (value) => {
		const changedValue = quantity > 0 && value > 0 ? parseInt(value) : 1;
		setQuantity(changedValue);
	};

	const handleAddToCart = async () => {
		await handleChangeQuantity(productId, quantity);
		showToast("Added");
	};

	const thumbnailImages = [
		"https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod2-1000x1000.jpg",
		"https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod4-1000x1000.jpg",
		"https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod1-800x800.jpg",
	];

	return (
		<Suspense
			fallback={
				<Loading
					size='h-16 w-16'
					customStyle='w-full h-screen flex flex-col items-center justify-center'
					hasLoadingText
				/>
			}>
			<section className='bg-gray-50'>
				<Banner
					imageBanner={ShopImageBanner}
					titleBanner='Shop'
					pathBanner='Shop'
				/>

				<div className='py-16 md:py-24 px-6'>
					<div className='container mx-auto'>
						<div className='grid md:grid-cols-2 gap-12'>
							<div>
								<div
									className='relative overflow-hidden rounded-lg shadow-md'
									onMouseMove={handleMouseMove}
									onMouseLeave={handleMouseLeave}>
									<img
										ref={imageRef}
										src={productDetails?.image || mainImage}
										alt={productDetails?.name || "Product Detail Name"}
										className='w-full h-[500px] object-cover transition-transform duration-300'
										style={{
											transformOrigin: `${position.x}% ${position.y}%`,
											transform: `scale(${position.scale})`,
										}}
									/>
								</div>
								<div className='flex items-center justify-start gap-4 mt-6'>
									{thumbnailImages.map((src, index) => (
										<button
											key={index}
											onClick={() => setMainImage(src)}
											className={`w-24 h-24 rounded-md overflow-hidden border-2 ${
												mainImage === src
													? "border-[#435D63]"
													: "border-transparent"
											} hover:opacity-100 transition-opacity duration-300 ${
												mainImage !== src ? "opacity-70" : ""
											}`}>
											<img
												src={src}
												alt={`Thumbnail ${index + 1}`}
												className='w-full h-full object-cover'
											/>
										</button>
									))}
								</div>
							</div>

							<div className='flex flex-col gap-6'>
								<h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
									{productDetails?.name || "Loading..."}
								</h1>
								<p className='text-2xl font-semibold text-gray-900'>
									{toVND(productDetails?.price) || "0.00"}
								</p>
								<p className='text-gray-600 text-lg leading-relaxed'>
									{productDetails?.description || "No description available."}
								</p>
								<div className='flex items-center gap-4 mt-4'>
									<FormControl
										type='number'
										wrapInputStyle='border-gray-300 w-24 rounded-md'
										inputStyle='text-center text-lg w-full py-2'
										value={quantity}
										onChange={(event) => changeQuantity(event.target.value)}
									/>
									<Button
										text='Add To Cart'
										Icon={BsCartPlus}
										iconStyle='text-white group-hover:!text-white'
										buttonStyle='py-3 px-6 bg-[#435D63] !text-white rounded-md hover:bg-white hover:border-[#435D63] border border-transparent group'
										textStyle='text-white group-hover:!text-white mr-2'
										onClick={handleAddToCart}
									/>
								</div>
								<div className='flex flex-col gap-2 mt-6'>
									<p className='text-gray-600'>
										Category:{" "}
										<span className='text-[#435D63] hover:underline cursor-pointer transition-colors duration-300'>
											{productDetails?.category?.name || "Organic"}
										</span>
									</p>
									<p className='text-gray-600'>
										Tags:{" "}
										<span className='text-[#435D63] hover:underline cursor-pointer transition-colors duration-300'>
											cream
										</span>
										,{" "}
										<span className='text-[#435D63] hover:underline cursor-pointer transition-colors duration-300'>
											face
										</span>
									</p>
								</div>
							</div>
						</div>
						<div className='mt-16'>
							<ProductDescription />
						</div>
					</div>
				</div>
			</section>
		</Suspense>
	);
};

export default ProductDetails;
