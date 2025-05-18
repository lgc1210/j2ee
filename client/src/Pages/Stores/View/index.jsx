import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
	FiHome,
	FiPhone,
	FiUser,
	FiMapPin,
	FiCalendar,
	FiClock,
	FiArrowLeft,
	FiAlignLeft,
} from "react-icons/fi";
import StoreService from "../../../Services/store";
import paths from "../../../Constants/paths";
import formatDate from "../../../Utils/formatDate";

const Loading = React.lazy(() => import("../../../Components/Loading"));

const View = () => {
	const [store, setStore] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const storeId = useLocation().pathname?.split("/").pop();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await StoreService.getStoreById(storeId);
				setStore(response.data);
			} catch (err) {
				setError("Failed to load store details");
			} finally {
				setLoading(false);
			}
		};

		if (storeId) fetchData();
	}, [storeId]);

	const handleBack = () => {
		navigate(paths.stores);
	};

	const DetailItem = ({ icon: Icon, label, value, isLinkedId }) => (
		<div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'>
			<div className='flex items-center p-5'>
				<div className='p-3 bg-[#435d63]/10 rounded-lg text-[#435d63] mr-4'>
					<Icon size={22} />
				</div>
				<div>
					<p className='text-sm font-medium text-gray-500'>{label}</p>
					{isLinkedId ? (
						<Link
							to={{ pathname: paths.userDetails.replace(":id", isLinkedId) }}
							className='font-medium text-gray-800 mt-1 hover:underline'>
							{value || "-"}
						</Link>
					) : (
						<p className='font-medium text-gray-800 mt-1'>{value || "-"}</p>
					)}
				</div>
			</div>
		</div>
	);

	return (
		<section className='px-4 py-6'>
			<div className='max-w-5xl mx-auto'>
				{/* Header section */}
				<div className='flex items-center justify-between mb-6'>
					<button
						onClick={handleBack}
						className='flex items-center gap-2 text-gray-600 hover:text-[#435d63] transition-colors'>
						<FiArrowLeft size={18} />
						<span className='font-medium'>Back to Stores</span>
					</button>

					<div>
						{store && (
							<div
								className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
									store?.status?.toLowerCase() === "active"
										? "bg-[#435d63]/10 text-[#435d63]"
										: "bg-red-400/10 text-red-500"
								}`}>
								{store.status}
							</div>
						)}
					</div>
				</div>

				{loading ? (
					<div className='flex justify-center py-32'>
						<Loading />
					</div>
				) : error ? (
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
						<div className='inline-flex items-center justify-center bg-red-50 p-4 rounded-full mb-4'>
							<div className='text-red-500'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='30'
									height='30'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<circle cx='12' cy='12' r='10' />
									<line x1='12' y1='8' x2='12' y2='12' />
									<line x1='12' y1='16' x2='12.01' y2='16' />
								</svg>
							</div>
						</div>
						<h2 className='text-xl font-semibold text-gray-800 mb-2'>
							Error Loading Store
						</h2>
						<p className='text-red-500 font-medium'>{error}</p>
						<p className='text-gray-500 text-sm mt-2 mb-6'>
							Please try again later
						</p>
						<button
							onClick={handleBack}
							className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors'>
							Go Back
						</button>
					</div>
				) : store ? (
					<div>
						{/* Header card */}
						<div className='bg-gradient-to-r from-[#435d63] to-[#2d4046] rounded-xl shadow-md p-6 mb-6 text-white relative overflow-hidden'>
							<div className='absolute top-0 right-0 opacity-10'>
								<svg
									width='180'
									height='180'
									viewBox='0 0 200 200'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										fill='white'
										d='M50,10 C100,30 150,10 190,70 L190,190 L10,190 L10,70 C40,30 20,30 50,10'
									/>
								</svg>
							</div>

							{/* Store image */}
							<div className='flex items-center mb-4'>
								<div className='mr-4'>
									<img
										src={
											store?.imageBase64 ||
											"https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg"
										}
										alt={store?.name}
										className='w-16 h-16 rounded-lg object-cover border-2 border-white/30'
									/>
								</div>
								<div>
									<p className='text-2xl font-bold mb-1'>{store?.name}</p>
									{store?.address && (
										<p className='text-[#c2d1d4] opacity-90 flex items-center gap-1'>
											<FiMapPin size={14} />
											<span>{store.address}</span>
										</p>
									)}
								</div>
							</div>

							<div className='inline-block bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm'>
								Store ID: {store.id}
							</div>
						</div>

						{/* Store details grid */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<DetailItem
								icon={FiAlignLeft}
								label='Description'
								value={store.description || "No description available"}
							/>
							<DetailItem
								icon={FiPhone}
								label='Phone Number'
								value={store.phone}
							/>
							<DetailItem
								icon={FiUser}
								label='Owner'
								value={store.owner?.name || "N/A"}
								isLinkedId={store.owner?.id}
							/>
							<DetailItem
								icon={FiMapPin}
								label='Address'
								value={store.address}
							/>
							<DetailItem
								icon={FiClock}
								label='Business Hours'
								value={
									store.open_time && store.close_time
										? `${store.open_time} - ${store.close_time}`
										: "Not specified"
								}
							/>
							<DetailItem
								icon={FiCalendar}
								label='Created At'
								value={formatDate(store?.created_at)}
							/>
						</div>

						{/* Action buttons */}
						<div className='mt-6 flex gap-3 justify-end'>
							<button
								className='px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors'
								onClick={handleBack}>
								Back
							</button>
						</div>
					</div>
				) : (
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center'>
						<div className='inline-flex items-center justify-center bg-[#435d63]/10 p-4 rounded-full mb-4'>
							<FiHome size={24} className='text-[#435d63]' />
						</div>
						<h2 className='text-xl font-semibold text-gray-800 mb-2'>
							No Store Found
						</h2>
						<p className='text-gray-500 mb-6'>
							The requested store could not be found
						</p>
						<button
							onClick={handleBack}
							className='px-4 py-2 bg-[#435d63] hover:bg-[#374c51] text-white rounded-lg transition-colors'>
							Back to Stores
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default View;
