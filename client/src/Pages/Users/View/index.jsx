import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	FiUser,
	FiMail,
	FiPhone,
	FiBriefcase,
	FiCalendar,
	FiClock,
	FiArrowLeft,
} from "react-icons/fi";
import UserService from "../../../Services/user";
import paths from "../../../Constants/paths";
import formatDate from "../../../Utils/formatDate";

const Loading = React.lazy(() => import("../../../Components/Loading"));

const View = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const userId = useLocation().pathname?.split("/").pop();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setLoading(true);
				const response = await UserService.getUserById(userId);
				setUser(response.data);
			} catch (err) {
				setError("Failed to load user details");
			} finally {
				setLoading(false);
			}
		};

		if (userId) fetchUser();
	}, [userId]);

	const handleBack = () => {
		navigate(paths.users);
	};

	const DetailItem = ({ icon: Icon, label, value }) => (
		<div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'>
			<div className='flex items-center p-5'>
				<div className='p-3 bg-[#435d63]/10 rounded-lg text-[#435d63] mr-4'>
					<Icon size={22} />
				</div>
				<div>
					<p className='text-sm font-medium text-gray-500'>{label}</p>
					<p className='font-medium text-gray-800 mt-1'>{value || "-"}</p>
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
						<span className='font-medium'>Back to Users</span>
					</button>

					<div>
						{user && (
							<div className='text-sm bg-[#435d63]/10 text-[#435d63] px-3 py-1 rounded-full font-medium'>
								{user.role?.name || "User"}
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
							Error Loading User
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
				) : user ? (
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
							<h1 className='text-2xl font-bold mb-1'>{user?.name}</h1>
							<a
								href={`mailto:${user?.email}`}
								className='text-[#c2d1d4] opacity-90 mb-4 block hover:underline w-fit'>
								{user?.email}
							</a>
							<div className='inline-block bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm'>
								User ID: {user.id}
							</div>
						</div>

						{/* User details grid */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<DetailItem
								icon={FiMail}
								label='Email Address'
								value={user.email}
							/>
							<DetailItem
								icon={FiPhone}
								label='Phone Number'
								value={user.phone}
							/>
							<DetailItem
								icon={FiBriefcase}
								label='Role'
								value={user.role?.name}
							/>
							<DetailItem
								icon={FiUser}
								label='Username'
								value={user.username || user.name}
							/>
							<DetailItem
								icon={FiCalendar}
								label='Created At'
								value={formatDate(user.created_at)}
							/>
							<DetailItem
								icon={FiClock}
								label='Updated At'
								value={formatDate(user.update_at)}
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
							<FiUser size={24} className='text-[#435d63]' />
						</div>
						<h2 className='text-xl font-semibold text-gray-800 mb-2'>
							No User Found
						</h2>
						<p className='text-gray-500 mb-6'>
							The requested user could not be found
						</p>
						<button
							onClick={handleBack}
							className='px-4 py-2 bg-[#435d63] hover:bg-[#374c51] text-white rounded-lg transition-colors'>
							Back to Users
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default View;
