import React from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";
import { useCart } from "../../Contexts/Cart";

const Loading = React.lazy(() => import("../../Components/Loading"));

const Cart = () => {
	const navigate = useNavigate();
	const { cart, handleChangeQuantity, handleDeleteFromCart } = useCart();

	const handleClickedProduct = (productId) => {
		navigate(paths.productDetails.replace(":id", productId), {
			state: { productId },
		});
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
			<section className='py-16'>
				<div className='rounded overflow-hidden shadow-md border container mx-auto flex lg:flex-row flex-col-reverse items-center w-full h-screen'>
					{/* Left */}
					<div className='shadow bg-white w-full h-full flex-grow p-8 overflow-y-auto'>
						<div>
							<div
								className='w-fit flex items-center justify-start cursor-pointer text-black/50 hover:text-black'
								onClick={() => navigate(paths.shop)}>
								<MdOutlineKeyboardArrowLeft size={20} />
								<p className='uppercase text-xs tracking-wider font-medium'>
									Back to store
								</p>
							</div>
							<div className='flex items-center justify-between mt-6'>
								<p className='text-5xl text-black/60'>Shopping cart</p>
								<p className='uppercase text-black/70 font-medium'>
									{cart?.items?.length || 0} items
								</p>
							</div>
						</div>
						<div className='overflow-x-auto'>
							{cart && cart?.items?.length !== 0 ? (
								<table className='mt-16 w-full min-w-[600px]'>
									<thead className=''>
										<tr>
											<th
												scope='col'
												className='w-3/6 text-start text-sm text-black/65'>
												Item
											</th>
											<th
												scope='col'
												className='w-1/6 text-start text-sm text-black/65'>
												Size
											</th>
											<th
												scope='col'
												className='w-1/6 text-start text-sm text-black/65'>
												Quantity
											</th>
											<th
												scope='col'
												className='w-1/6 text-start text-sm text-black/65'>
												Price
											</th>
											<th
												scope='col'
												className='w-[5%] text-start text-sm text-black/65'></th>
										</tr>
									</thead>
									<tbody>
										{cart?.items?.map((item) => {
											return (
												<tr key={item?.id}>
													<td
														className='py-4 cursor-pointer'
														onClick={() =>
															handleClickedProduct(item?.product?.id)
														}>
														<div className='flex items-center justify-start gap-2'>
															{/* Image */}
															<div className='md:size-1/6 size-1/4 rounded overflow-hidden'>
																<img
																	src='https://lesya.bslthemes.com/wp-content/uploads/2022/05/prod2-1000x1000.jpg'
																	alt='Product thumbnail'
																	className='w-full h-full object-cover object-center'
																/>
															</div>
															<div className=''>
																<p className='text-xl'>{item?.product?.name}</p>
																<p className='uppercase mt-4 text-xs tracking-wider text-black/60 font-medium'>
																	{item?.product?.category?.name}
																</p>
															</div>
														</div>
													</td>
													<td className='font-medium text-black/65'>255ml</td>
													<td className='py-4'>
														<div className='flex items-center justify-start gap-2'>
															<FiMinusCircle
																className={`${
																	item?.quantity <= 1
																		? "text-black/30 cursor-not-allowed pointer-events-none"
																		: "cursor-pointer"
																}`}
																size={18}
																onClick={() =>
																	changeQuantity(item?.product?.id, -1)
																}
															/>
															<p>{item?.quantity}</p>
															<FiPlusCircle
																className='cursor-pointer'
																size={18}
																onClick={() =>
																	changeQuantity(item?.product?.id, 1)
																}
															/>
														</div>
													</td>
													<td className='text-black/65 font-medium py-4'>
														40.000 đ
													</td>
													<td className='py-4 text-center'>
														<IoClose
															className='cursor-pointer block'
															size={18}
															onClick={() =>
																handleDeleteItem(item?.product?.id)
															}
														/>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							) : (
								<div className='flex items-center justify-center h-52'>
									<p className=''>
										No items in your cart.{" "}
										<span
											className='underline text-[#779AA1] cursor-pointer'
											onClick={() => navigate(paths.shop)}>
											Let's shopping now!
										</span>
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Right */}
					<div className='shadow bg-black/5 lg:max-w-sm w-full h-full p-8'>
						<div className='flex flex-col h-full'>
							<div>
								<p className='text-2xl font-medium text-black/60'>Summary</p>
							</div>
							<div className='flex flex-col gap-2 mt-8'>
								<span className='flex items-center justify-between'>
									<p className='text-black/65 font-medium'>Subtotal</p>
									<p className='font-medium text-black'>252.000 đ</p>
								</span>
								<span className='flex items-center justify-between'>
									<p className='text-black/65 font-medium'>Shipping</p>
									<p className='font-medium text-black'>0.000 đ</p>
								</span>
								<span className='flex items-center justify-between'>
									<p className='text-black/65 font-medium'>Tax</p>
									<p className='font-medium text-black'>39.000 đ</p>
								</span>
								<span className='flex items-center justify-between mt-8'>
									<p className='text-black/65 font-medium'>Promocode</p>
									<input
										type='text'
										placeholder='enter code'
										className='bg-transparent text-end outline-none border-b'
									/>
								</span>
							</div>
							<div className='h-full flex flex-col justify-end'>
								<span className='flex items-center justify-between'>
									<p className='text-black/65 font-medium'>Total</p>
									<p className='font-medium text-black text-xl'>252.000 đ</p>
								</span>
								<button className='justify-end uppercase font-medium bg-black/80 hover:bg-black text-white tracking-wider mt-4 py-4 w-full'>
									Checkout
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</React.Suspense>
	);
};

export default Cart;
