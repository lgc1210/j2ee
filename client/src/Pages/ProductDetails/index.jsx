import React, { useState, useRef, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import ShopImageBanner from "../../assets/images/banner/uby-yanes-0ABufdkXgPI-unsplash-900x900.jpg";
import { BsCartPlus } from "react-icons/bs";

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

	const handleMouseMove = (event) => {
		const image = imageRef.current;

		if (!image) {
			return;
		}

		const rect = image.getBoundingClientRect();

		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		setPosition({ x, y, scale: 2 });
	};

	const handleMouseLeave = () => {
		setPosition({ x: 0, y: 0, scale: 1 });
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
				<Banner imageBanner={ShopImageBanner} titleBanner='Shop' pathBanner='Shop' />

				<div className='md:py-36 py-28 md:px-0 px-6'>
					<div className='container mx-auto'>
						{/* Product */}
						<div className='grid md:grid-cols-2 gap-20'>
							{/* Product Image */}
							<div className=''>
								<div
									className='overflow-hidden'
									onMouseMove={handleMouseMove}
									onMouseLeave={handleMouseLeave}>
									<img
										ref={imageRef}
										src={mainImage}
										alt='Product Detail Name'
										className='transition-transform duration-700 w-full h-full object-cover'
										style={{
											transformOrigin: `${position.x}% ${position.y}%`,
											transform: `scale(${position.scale})`,
										}}
									/>
								</div>
								{/* List of images */}
								<div className='flex items-center justify-start gap-4 mt-14'>
									<div
										className=''
										onClick={() =>
											setMainImage(
												"https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod2-1000x1000.jpg"
											)
										}>
										<img
											src='https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod2-1000x1000.jpg'
											alt='Another Product'
											className='max-w-36 w-full h-full object-center object-cover'
										/>
									</div>
									<div
										className='opacity-50 hover:opacity-100 cursor-pointer'
										onClick={() =>
											setMainImage(
												"https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod4-1000x1000.jpg"
											)
										}>
										<img
											src='https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod4-1000x1000.jpg'
											alt='Another Product'
											className='max-w-36 w-full h-full object-center object-cover'
										/>
									</div>
									<div
										className='opacity-50 hover:opacity-100 cursor-pointer'
										onClick={() =>
											setMainImage(
												"https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod1-800x800.jpg"
											)
										}>
										<img
											src='https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod1-800x800.jpg'
											alt='Another Product'
											className='max-w-36 w-full h-full object-center object-cover'
										/>
									</div>
								</div>
							</div>

							{/* Product's Information */}
							<div>
								<div className='flex flex-col gap-6'>
									<p className='font-serif text-4xl'>Beauty Care</p>
									<p className='text-2xl font-semibold'>$59.00</p>
									<p className='text-lg text-zinc-600 lg:w-3/4 lg:text-start text-justify leading-loose'>
										Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
										quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque
										porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
										velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
										magnam aliquam quaerat voluptatem.
									</p>
								</div>
								<div className='flex items-center justify-start gap-4 my-8'>
									<FormControl
										type='number'
										wrapInputStyle='border-zinc-400 w-1/6'
										inputStyle='text-center text-lg w-full'
										value={quantity}
										onChange={(event) => setQuantity(event.target.value)}
									/>
									<Button
										text='Add To Cart'
										Icon={BsCartPlus}
										iconStyle='text-white [&]:group-hover:text-black'
										buttonStyle='[&]:py-4.5 bg-[#779AA1] [&]:border-[#779AA1] [&]:hover:border-black'
										textStyle='text-white me-2 [&]:group-hover:text-black'
										hoverStyle='[&]:bg-white'
									/>
								</div>
								<div className='flex flex-col gap-2'>
									<p className='text-lg text-zinc-600'>
										Category:{" "}
										<span className='underline hover:no-underline cursor-pointer text-[#779AA1] transition-all duration-700'>
											Organic
										</span>
									</p>
									<p className='text-lg text-zinc-600'>
										Tags:{" "}
										<span className='underline hover:no-underline cursor-pointer text-[#779AA1] transition-all duration-700'>
											cream
										</span>
										,
										<span className='underline hover:no-underline cursor-pointer text-[#779AA1] transition-all duration-700'>
											{" "}
											face
										</span>
									</p>
								</div>
							</div>
						</div>
						{/* Description */}
						<ProductDescription />
					</div>
				</div>
			</section>
		</Suspense>
	);
};

export default ProductDetails;
