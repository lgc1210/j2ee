import React from "react";
import { items } from "./items";
import { useLocation, useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const ConfirmPopup = React.lazy(() => import("../../Components/ConfirmPopup"));

const ProfileSidebar = () => {
	const [showPopup, setShowPopup] = React.useState(false);
	const [isActive, setIsActive] = React.useState(false);
	const navigate = useNavigate();
	const currentPath = useLocation().pathname;

	const handleItemClicked = (path) => {
		navigate(path);
	};

	return (
		<>
			<aside className='bg-white shadow-md rounded-md w-80 p-4 min-h-screen'>
				<div
					className='w-fit flex items-center justify-start cursor-pointer text-black/50 hover:text-black'
					onClick={() => navigate(paths.home)}>
					<MdOutlineKeyboardArrowLeft size={20} />
					<p className='uppercase text-xs tracking-wider font-medium'>Back to home page</p>
				</div>
				<ul className='flex flex-col gap-1 mt-4'>
					{items.map((item) => {
						return (
							<li
								key={item?.id}
								className='group'
								onClick={() =>
									item?.deleteItem ? setShowPopup(true) : handleItemClicked(item?.path)
								}>
								<p
									className={`truncate font-semibold rounded p-2 cursor-pointer ${
										item?.deleteItem
											? "text-red-500 group-hover:text-red-700"
											: "group-hover:bg-[#274b609f] group-hover:text-white"
									} ${currentPath === item?.path ? "bg-[#274b609f] text-white" : ""}`}>
									{item?.name}
								</p>
							</li>
						);
					})}
				</ul>
			</aside>

			<ConfirmPopup
				toggle={showPopup}
				setToggle={() => setShowPopup(false)}
				title='Are you sure you want to delete your account?'
				message='This action can be undone.'
				okButtonText='Accept'
				cancelButtonText='Cancel'
				onOk={() => {
					setShowPopup(false);
					// console.log("Account deleted");
				}}
				onCancel={() => setShowPopup(false)}
			/>
		</>
	);
};

export default ProfileSidebar;
