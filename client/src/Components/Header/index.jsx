import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/header/lesya-logo.png";
import navItems from "./navItems";
import paths from "../../Constants/paths";
import { IoIosArrowDown } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { HiSearch } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useAuth } from "../../Contexts/Auth";
import { GoArrowRight } from "react-icons/go";

const Header = () => {
	const navigate = useNavigate();
	const [toggleNav, setToggleNav] = React.useState(true);
	const [isSticky, setIsSticky] = React.useState(false);
	const headerRef = React.useRef(null);
	const { logout, isAuthenticated } = useAuth();
	const [showSearchInput, setShowSearchInput] = React.useState(false);
	const searchInputRef = React.useRef(null);

	React.useEffect(() => {
		const header = headerRef.current;
		const sticky = header.offsetHeight;

		const handleScroll = () => {
			setIsSticky(window.pageYOffset > sticky);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	React.useEffect(() => {
		const handleClickOutside = (event) => {
			if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
				setShowSearchInput(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleNavigation = (path, haveChildren = false) => {
		if (!haveChildren) {
			navigate(path);
		}
	};

	const handleLogout = async () => {
		await logout();
	};

	// Filter function to check if a nav item should be displayed
	const shouldDisplayNavItem = (item) => {
		// If item requires auth and user is not authenticated, don't show
		if (item.requiresAuth && !isAuthenticated) {
			return false;
		}
		// If item should be hidden when authenticated and user is authenticated, don't show
		if (item.hideWhenAuth && isAuthenticated) {
			return false;
		}
		return true;
	};

	// Filter function to check if a child item should be displayed
	const shouldDisplayChildItem = (childItem) => {
		// If child requires auth and user is not authenticated, don't show
		if (childItem.requiresAuth && !isAuthenticated) {
			return false;
		}
		// If child should be hidden when authenticated and user is authenticated, don't show
		if (childItem.hideWhenAuth && isAuthenticated) {
			return false;
		}
		return true;
	};

	const handleClickedNavItem = (childItem) => {
		// setToggleNav(false);
		childItem?.auth && isAuthenticated
			? handleLogout()
			: handleNavigation(childItem?.path, childItem?.children);
	};

	return (
		<header
			className={`relative md:px-14 px-6 shadow w-full h-24 z-30 bg-white ${
				isSticky ? "sticky top-0 right-0 left-0" : "relative"
			}`}
			ref={headerRef}>
			<div className='h-full flex items-center justify-between md:flex-wrap flex-nowrap'>
				{/* Small screens */}
				<HiOutlineBars3
					size={30}
					className='md:hidden block cursor-pointer'
					onClick={() => setToggleNav(!toggleNav)}
				/>

				<div className='md:order-1 order-2 cursor-pointer' onClick={() => navigate(paths.home)}>
					<img src={Logo} alt='Logo' className='max-w-40 h-full object-contain object-center' />
				</div>

				<nav
					className={`transition-all durtaion-500 md:py-0 py-8 bg-white lg:order-2 md:order-3 order-1 md:flex-row md:relative md:top-0 absolute z-20 top-full right-0 left-0 flex-col items-center justify-center xl:gap-16 gap-4 xl:px-0 px-8 ${
						toggleNav ? "flex" : "hidden"
					}`}>
					{navItems.filter(shouldDisplayNavItem).map((item, index) => {
						return (
							<div
								key={index}
								className='xl:text-lg relative group'
								onClick={() => handleNavigation(item?.path, item?.children)}>
								<span className='uppercase cursor-pointer font-sans text-lg flex items-center justify-center gap-2 transition-all duration-500 group-hover:text-[#799AA1]'>
									<p>{item.name}</p>
									{item?.children && <IoIosArrowDown />}
								</span>

								{/* Sub nav */}
								{item?.children && (
									<div className='md:bg-white bg-gray-200 cursor-pointer text-md md:max-w-xl md:w-80 w-screen hidden md:absolute md:top-full shadow transition-all duration-500 group-hover:block'>
										{item.children.filter(shouldDisplayChildItem).map((childItem, index) => {
											return (
												<div
													key={index}
													className='py-2 px-4 border-t hover:text-[#799AA1] transition-all duration-500 w-full'
													onClick={() => handleClickedNavItem(childItem)}>
													{childItem.name}
												</div>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</nav>

				<div className='order-3 md:order-2 flex items-center justify-center md:gap-8 gap-4'>
					<div className='relative' onClick={() => navigate(paths.cart)}>
						<FaCartShopping size={24} className='cursor-pointer' />
						<span className='text-center leading-tight absolute -top-4 -right-4 bg-[#799AA1] text-white min-w-5 h-auto rounded-full'>
							1
						</span>
					</div>
					<div className='md:block hidden'>
						<HiSearch
							size={24}
							className='cursor-pointer'
							onClick={() => {
								setShowSearchInput(!showSearchInput);
							}}
						/>
					</div>
					<div>
						<BsThreeDotsVertical size={24} className='cursor-pointer' />
					</div>
				</div>
			</div>

			{/* Search input */}
			<div
				ref={searchInputRef}
				className={`transition duration-500 absolute right-0 bg-white border shadow flex items-center ${
					showSearchInput
						? "translate-y-0 opacity-100 pointer-events-auto"
						: "-translate-y-full opacity-0 pointer-events-none"
				}`}>
				<input type='text' placeholder='Enter your keyword' className='py-2 px-4 outline-none' />
				<button className='bg-[#779AA1]'>
					<GoArrowRight size={20} className='text-white w-full h-full p-3' />
				</button>
			</div>
		</header>
	);
};

export default Header;
