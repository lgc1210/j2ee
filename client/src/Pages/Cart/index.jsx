import React from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";
import { useCart } from "../../Contexts/Cart";
import { toVND } from "../../Utils/vietnamCurrency";
import { useAuth } from "../../Contexts/Auth";

const Loading = React.lazy(() => import("../../Components/Loading"));

const SHIPPING_FEE = 40000;

const Cart = () => {
	const navigate = useNavigate();
	const { cart, totalPrice, handleChangeQuantity, handleDeleteFromCart } =
		useCart();
	const { isAuthenticated } = useAuth();

	const handleClickedProduct = (productId) => {
		navigate(paths.productDetails.replace(":id", productId), {
			state: { productId },
		});
	};

	const moveOnToCheckout = () => {
		if (!isAuthenticated) return;
		navigate(paths.checkout);
	};

	const changeQuantity = async (productId, quantity) => {
		await handleChangeQuantity(productId, quantity);
	};

	const handleDeleteItem = async (productId) => {
		await handleDeleteFromCart(productId);
	};

	return (
		<React.Suspense
			fallback={
				<Loading
					size='h-16 w-16'
					customStyle='w-full h-screen flex flex-col items-center justify-center'
					hasLoadingText
				/>
			}>
			<section className='py-16 px-4 md:px-8 bg-gradient-to-br from-gray-50 to-white min-h-screen'>
				<div className='container mx-auto max-w-6xl'>
					{/* Back to store */}
					<div
						className='flex items-center gap-2 text-gray-500 hover:text-black transition-colors duration-300 cursor-pointer mb-12 animate-fadeIn'
						onClick={() => navigate(paths.shop)}>
						<MdOutlineKeyboardArrowLeft size={20} />
						<span className='text-sm font-medium uppercase tracking-widest'>
							Back to Store
						</span>
					</div>

					{/* Cart title */}
					<div className='flex items-center justify-between mb-16 animate-fadeIn'>
						<h1 className='text-4xl font-light text-gray-900 tracking-tight'>
							Your Cart
						</h1>
						<p className='text-sm text-gray-500 font-medium'>
							{cart?.length || 0} {cart?.length === 1 ? "item" : "items"}
						</p>
					</div>

					<div className='flex flex-col lg:flex-row gap-12'>
						{/* Cart items */}
						<div className='flex-grow'>
							{cart && cart?.length !== 0 ? (
								<div className='space-y-10'>
									{/* Cart header - Desktop only */}
									<div className='hidden md:grid md:grid-cols-12 pb-4 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-widest'>
										<div className='col-span-6'>Product</div>
										<div className='col-span-2'>Price</div>
										<div className='col-span-2'>Quantity</div>
										<div className='col-span-2 text-right'>Total</div>
									</div>

									{/* Cart items */}
									{cart?.map((item) => (
										<div
											key={item?.id}
											className='group relative md:grid md:grid-cols-12 items-center pb-8 border-b border-gray-200 hover:scale-[1.02] transition-transform duration-300 animate-fadeIn'>
											{/* Product info */}
											<div className='col-span-6 flex gap-6 mb-6 md:mb-0 pr-10 md:pr-0'>
												<div
													className='h-28 w-28 overflow-hidden cursor-pointer bg-gray-100 rounded-lg shadow-sm'
													onClick={() =>
														handleClickedProduct(item?.product?.id)
													}>
													<img
														src='https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod2-1000x1000.jpg'
														alt={item?.product?.name}
														className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
													/>
												</div>
												<div className='flex flex-col justify-center'>
													<p
														className='font-medium text-gray-900 hover:text-gray-700 cursor-pointer tracking-wide text-lg'
														onClick={() =>
															handleClickedProduct(item?.product?.id)
														}>
														{item?.product?.name}
													</p>
													<p className='text-sm text-gray-500 uppercase tracking-wider mt-1'>
														{item?.product?.category?.name}
													</p>
													<p className='text-sm text-gray-500 mt-1'>
														weight: {item?.product?.weight}
													</p>
												</div>
												{/* Remove button - Mobile */}
												<button
													className='absolute right-0 top-0 md:hidden text-gray-400 hover:text-gray-900 transition-colors p-2'
													onClick={() => handleDeleteItem(item?.product?.id)}
													aria-label='Remove item'>
													<IoClose size={20} />
												</button>
											</div>

											{/* Price */}
											<div className='col-span-2 text-base text-gray-600 mb-4 md:mb-0'>
												<span className='md:hidden text-sm text-gray-500 mr-2'>
													Price:{" "}
												</span>
												{toVND(item?.product?.price)}
											</div>

											{/* Quantity */}
											<div className='col-span-2 mb-4 md:mb-0'>
												<div className='inline-flex items-center border border-gray-300 rounded-full bg-white shadow-sm'>
													<button
														className={`px-4 py-2 text-lg ${
															item?.quantity <= 1
																? "text-gray-300 cursor-not-allowed"
																: "text-gray-600 hover:text-gray-900"
														}`}
														disabled={item?.quantity <= 1}
														onClick={() =>
															changeQuantity(item?.product?.id, -1)
														}>
														−
													</button>
													<span className='text-base font-medium w-12 text-center'>
														{item?.quantity}
													</span>
													<button
														className='px-4 py-2 text-lg text-gray-600 hover:text-gray-900'
														onClick={() =>
															changeQuantity(item?.product?.id, 1)
														}>
														+
													</button>
												</div>
											</div>

											<div className='flex items-center'>
												{/* Total price */}
												<div className='col-span-2 text-right text-base font-medium text-gray-900'>
													<span className='md:hidden text-sm text-gray-500'>
														Total:{" "}
													</span>
													{toVND(item?.productTotalPrice)}
												</div>

												{/* Remove button - Desktop */}
												<div className='hidden md:block absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
													<button
														className='text-gray-400 hover:text-gray-900 transition-colors'
														onClick={() => handleDeleteItem(item?.product?.id)}
														aria-label='Remove item'>
														<IoClose size={20} />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className='py-20 text-center animate-fadeIn'>
									<p className='text-gray-600 font-medium text-lg'>
										Your cart is empty.{" "}
										<span
											className='text-black hover:underline cursor-pointer'
											onClick={() => navigate(paths.shop)}>
											Continue shopping
										</span>
									</p>
								</div>
							)}
						</div>

						{/* Order summary */}
						<div className='w-full lg:w-80 mt-12 lg:mt-0'>
							<div className='bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg animate-fadeIn'>
								<h2 className='text-lg font-medium text-gray-900 pb-6 border-b border-gray-200'>
									Order Summary
								</h2>
								<div className='space-y-5 py-6'>
									<div className='flex justify-between'>
										<span className='text-gray-600 font-medium'>Subtotal</span>
										<span className='text-gray-900'>{toVND(totalPrice)}</span>
									</div>
									<div className='flex justify-between'>
										<span className='text-gray-600 font-medium'>Shipping</span>
										<span className='text-gray-900'>
											{toVND(isAuthenticated ? SHIPPING_FEE : 0)}
										</span>
									</div>
								</div>
								<div className='pt-6 border-t border-gray-200'>
									<div className='flex justify-between mb-8'>
										<span className='text-gray-900 font-medium'>Total</span>
										<span className='text-2xl font-medium text-gray-900'>
											{toVND(isAuthenticated ? totalPrice + SHIPPING_FEE : 0)}
										</span>
									</div>
									<button
										disabled={!isAuthenticated}
										className={`w-full py-4 bg-black text-white font-medium tracking-widest text-sm rounded-lg transition-all ${
											!isAuthenticated
												? "opacity-50 cursor-not-allowed"
												: "hover:bg-gray-900 hover:scale-[1.02]"
										}`}
										onClick={moveOnToCheckout}>
										Proceed to Checkout
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</React.Suspense>
	);
};

export default Cart;
