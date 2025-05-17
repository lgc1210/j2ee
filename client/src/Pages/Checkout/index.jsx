import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth";
import AddressService from "../../Services/address";
import { useCart } from "../../Contexts/Cart";
import { toVND } from "../../Utils/vietnamCurrency";

const Checkout = () => {
	const [formData, setFormData] = useState({
		email: "",
		name: "",
		phone: "",
		address: "",
		province: "",
		district: "",
		ward: "",
		paymentMethod: "",
		selectedAddress: "",
	});
	const [errors, setErrors] = useState({});
	const [addressOption, setAddressOption] = useState("manual");
	const [activePayment, setActivePayment] = useState("card");
	const [addressList, setAddressList] = useState({
		addresses: [],
		totalPages: 0,
		currentPage: 0,
		totalElements: 0,
	});
	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);
	const { user } = useAuth();
	const { cart, totalPrice } = useCart();

	const SHIPPING_FEE = 40000;

	// Set logged-in user's information by default
	useEffect(() => {
		if (user) {
			setFormData((prev) => ({
				...prev,
				email: user?.email || "",
				phone: user?.phone || "",
				name: user?.name || "",
			}));
		}
	}, [user]);

	// Fetch provinces and user addresses
	useEffect(() => {
		const fetchAddressList = async () => {
			try {
				const response = await AddressService.getAllByUserId(user?.id);
				if (response?.status === 200) {
					setAddressList(
						response?.data || {
							addresses: [],
							totalPages: 0,
							currentPage: 0,
							totalElements: 0,
						}
					);
				}
			} catch (error) {
				console.error("Fetching addresses failed", error);
				setAddressList({
					addresses: [],
					totalPages: 0,
					currentPage: 0,
					totalElements: 0,
				});
			}
		};

		const fetchProvinces = async () => {
			try {
				const response = await AddressService.getProvinces();
				if (response?.status === 200 && response?.data) {
					setProvinces(response?.data || []);
				}
			} catch (error) {
				console.error("Fetching provinces failed", error);
				setProvinces([]);
			}
		};

		if (user?.id) {
			fetchAddressList();
		}
		fetchProvinces();
	}, [user?.id]);

	// Fetch districts when province changes
	useEffect(() => {
		if (formData.province) {
			const selectedProvince = provinces.find(
				(p) => p.name === formData.province
			);
			setDistricts(selectedProvince?.districts || []);
			setFormData((prev) => ({ ...prev, district: "", ward: "" }));
			setWards([]);
		}
	}, [formData.province, provinces]);

	// Fetch wards when district changes
	useEffect(() => {
		if (formData.district) {
			const selectedDistrict = districts.find(
				(d) => d.name === formData.district
			);
			setWards(selectedDistrict?.wards || []);
			setFormData((prev) => ({ ...prev, ward: "" }));
		}
	}, [formData.district, districts]);

	// Handle saved address selection
	useEffect(() => {
		if (formData.selectedAddress && addressOption === "saved") {
			const selectedAddr = addressList.addresses.find(
				(addr) => addr.id === parseInt(formData.selectedAddress)
			);
			if (selectedAddr) {
				setFormData((prev) => ({
					...prev,
					name: selectedAddr.name || prev.name,
					phone: selectedAddr.phone || prev.phone,
					address: selectedAddr.address || "",
					province: selectedAddr.province || "",
					district: selectedAddr.district || "",
					ward: selectedAddr.ward || "",
				}));
			}
		} else {
			setFormData((prev) => ({
				...prev,
				address: "",
				province: "",
				district: "",
				ward: "",
			}));
		}
	}, [formData.selectedAddress, addressOption, addressList.addresses]);

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error for the field being edited
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {};

		// Contact Information
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Invalid email format";
		}
		if (!formData.name) {
			newErrors.name = "Full name is required";
		}
		if (!formData.phone) {
			newErrors.phone = "Phone number is required";
		} else if (!/^\d{10}$/.test(formData.phone)) {
			newErrors.phone = "Phone number must be 10 digits";
		}

		// Shipping Information
		if (addressOption === "manual") {
			if (!formData.address) {
				newErrors.address = "Address is required";
			}
			if (!formData.province) {
				newErrors.province = "Province is required";
			}
			if (!formData.district) {
				newErrors.district = "District is required";
			}
			if (!formData.ward) {
				newErrors.ward = "Ward is required";
			}
		} else if (addressOption === "saved" && !formData.selectedAddress) {
			newErrors.selectedAddress = "Please select an address";
		}

		// Payment Method
		if (!formData.paymentMethod) {
			newErrors.paymentMethod = "Please select a payment method";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle address option toggle
	const handleAddressOptionChange = (option) => {
		setAddressOption(option);
		if (option === "saved") {
			setFormData((prev) => ({
				...prev,
				address: "",
				province: "",
				district: "",
				ward: "",
				selectedAddress: "",
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				selectedAddress: "",
			}));
		}
		setErrors({});
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			const finalAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`;
			const orderData = {
				...formData,
				finalAddress,
			};
			console.log("Order submitted:", orderData);
			// Add order processing logic here
		}
	};

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8'>
			<div className='w-full max-w-6xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row'>
				{/* Form Section */}
				<div className='p-6 md:p-10 flex-1'>
					<Link
						to='/cart'
						className='text-sm text-[#799aa1] hover:underline mb-6 inline-block'>
						Back to cart
					</Link>
					<h1 className='text-3xl font-bold text-gray-800 mb-8'>Checkout</h1>

					<form onSubmit={handleSubmit} className='space-y-8'>
						{/* Contact Information */}
						<div>
							<h2 className='text-xl font-semibold text-gray-700 mb-4'>
								Contact Information
							</h2>
							<div className='space-y-4'>
								<div>
									<label
										className='block text-sm text-gray-600 mb-1'
										htmlFor='email'>
										Email
									</label>
									<input
										type='email'
										id='email'
										name='email'
										value={formData.email}
										onChange={handleChange}
										className={`w-full px-4 py-3 border ${
											errors.email ? "border-red-500" : "border-gray-300"
										} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]`}
									/>
									{errors.email && (
										<p className='text-red-500 text-sm mt-1'>{errors.email}</p>
									)}
								</div>
								<div>
									<label
										className='block text-sm text-gray-600 mb-1'
										htmlFor='phone'>
										Phone
									</label>
									<input
										type='tel'
										id='phone'
										name='phone'
										value={formData.phone}
										onChange={handleChange}
										className={`w-full px-4 py-3 border ${
											errors.phone ? "border-red-500" : "border-gray-300"
										} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]`}
									/>
									{errors.phone && (
										<p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
									)}
								</div>
								<div>
									<label
										className='block text-sm text-gray-600 mb-1'
										htmlFor='name'>
										Full Name
									</label>
									<input
										type='text'
										id='name'
										name='name'
										value={formData.name}
										onChange={handleChange}
										className={`w-full px-4 py-3 border ${
											errors.name ? "border-red-500" : "border-gray-300"
										} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]`}
									/>
									{errors.name && (
										<p className='text-red-500 text-sm mt-1'>{errors.name}</p>
									)}
								</div>
							</div>
						</div>

						{/* Shipping Information */}
						<div>
							<h2 className='text-xl font-semibold text-gray-700 mb-4'>
								Shipping Information
							</h2>

							{addressList.addresses.length > 0 && (
								<div className='flex space-x-4 mb-6'>
									<button
										type='button'
										className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
											addressOption === "manual"
												? "border-2 border-[#799aa1] bg-[#799aa1]/10"
												: "border border-gray-300"
										}`}
										onClick={() => handleAddressOptionChange("manual")}>
										Enter Address Manually
									</button>
									<button
										type='button'
										className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
											addressOption === "saved"
												? "border-2 border-[#799aa1] bg-[#799aa1]/10"
												: "border border-gray-300"
										}`}
										onClick={() => handleAddressOptionChange("saved")}>
										Use Saved Address
									</button>
								</div>
							)}

							{addressOption === "saved" && addressList.addresses.length > 0 ? (
								<div className='mb-4'>
									<label
										className='block text-sm text-gray-600 mb-1'
										htmlFor='addressSelect'>
										Select Address
									</label>
									<select
										id='addressSelect'
										name='selectedAddress'
										value={formData.selectedAddress}
										onChange={handleChange}
										className={`w-full px-4 py-3 border ${
											errors.selectedAddress
												? "border-red-500"
												: "border-gray-300"
										} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]`}>
										<option value=''>Select an address</option>
										{addressList?.addresses?.map((addr) => (
											<option key={addr.id} value={addr.id}>
												{`${addr.name}, ${addr.phone}, ${addr.address}${
													addr.is_default ? " (Default)" : ""
												}${addr.type ? ` - ${addr.type}` : ""}`}
											</option>
										))}
									</select>
									{errors.selectedAddress && (
										<p className='text-red-500 text-sm mt-1'>
											{errors.selectedAddress}
										</p>
									)}
									<button
										type='button'
										onClick={() => handleAddressOptionChange("manual")}
										className='text-sm text-[#799aa1] hover:underline mt-2'>
										Enter a new address instead
									</button>
								</div>
							) : (
								<div className='space-y-4'>
									<div>
										<label
											className='block text-sm text-gray-600 mb-1'
											htmlFor='address'>
											Address
										</label>
										<input
											type='text'
											id='address'
											name='address'
											value={formData.address}
											onChange={handleChange}
											className={`w-full px-4 py-3 border ${
												errors.address ? "border-red-500" : "border-gray-300"
											} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]`}
										/>
										{errors.address && (
											<p className='text-red-500 text-sm mt-1'>
												{errors.address}
											</p>
										)}
									</div>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<div>
											<label
												className='block text-sm text-gray-600 mb-1'
												htmlFor='province'>
												Province
											</label>
											<select
												id='province'
												name='province'
												value={formData.province}
												onChange={handleChange}
												className={`w-full px-4 py-3 border ${
													errors.province ? "border-red-500" : "border-gray-300"
												} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]`}>
												<option value=''>Select province</option>
												{provinces.map((province) => (
													<option key={province.code} value={province.name}>
														{province.name}
													</option>
												))}
											</select>
											{errors.province && (
												<p className='text-red-500 text-sm mt-1'>
													{errors.province}
												</p>
											)}
										</div>
										<div>
											<label
												className='block text-sm text-gray-600 mb-1'
												htmlFor='district'>
												District
											</label>
											<select
												id='district'
												name='district'
												value={formData.district}
												onChange={handleChange}
												className={`w-full px-4 py-3 border ${
													errors.district ? "border-red-500" : "border-gray-300"
												} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]`}
												disabled={!formData.province}>
												<option value=''>Select district</option>
												{districts.map((district) => (
													<option key={district.code} value={district.name}>
														{district.name}
													</option>
												))}
											</select>
											{errors.district && (
												<p className='text-red-500 text-sm mt-1'>
													{errors.district}
												</p>
											)}
										</div>
										<div>
											<label
												className='block text-sm text-gray-600 mb-1'
												htmlFor='ward'>
												Ward
											</label>
											<select
												id='ward'
												name='ward'
												value={formData.ward}
												onChange={handleChange}
												className={`w-full px-4 py-3 border ${
													errors.ward ? "border-red-500" : "border-gray-300"
												} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]`}
												disabled={!formData.district}>
												<option value=''>Select ward</option>
												{wards.map((ward) => (
													<option key={ward.code} value={ward.name}>
														{ward.name}
													</option>
												))}
											</select>
											{errors.ward && (
												<p className='text-red-500 text-sm mt-1'>
													{errors.ward}
												</p>
											)}
										</div>
									</div>
									{addressList.addresses.length > 0 && (
										<button
											type='button'
											onClick={() => handleAddressOptionChange("saved")}
											className='text-sm text-[#799aa1] hover:underline'>
											Select from saved addresses instead
										</button>
									)}
								</div>
							)}
						</div>

						{/* Payment Methods */}
						<div>
							<h2 className='text-xl font-semibold text-gray-700 mb-4'>
								Payment Method
							</h2>
							<div className='grid grid-cols-3 gap-4 mb-6'>
								{["cash", "paypal", "apple"].map((method) => (
									<button
										key={method}
										type='button'
										className={`py-3 rounded-lg text-sm font-medium transition-all ${
											activePayment === method
												? "border-2 border-[#799aa1] bg-[#799aa1]/10"
												: "border border-gray-300"
										}`}
										onClick={() => {
											setActivePayment(method);
											setFormData((prev) => ({
												...prev,
												paymentMethod: method,
											}));
											setErrors((prev) => ({ ...prev, paymentMethod: "" }));
										}}>
										{method.charAt(0).toUpperCase() + method.slice(1)}{" "}
										{method === "cash" ? "On Delivery" : "Pay"}
									</button>
								))}
							</div>
							{errors.paymentMethod && (
								<p className='text-red-500 text-sm mb-4'>
									{errors.paymentMethod}
								</p>
							)}
							<div className='text-center py-4 text-gray-600'>
								{activePayment === "cash" &&
									"You'll pay after receiving your purchase."}
								{activePayment === "paypal" &&
									"You'll be redirected to PayPal to complete your payment."}
								{activePayment === "apple" &&
									"You'll be redirected to Apple Pay to complete your payment."}
							</div>
						</div>

						<button
							type='submit'
							className='w-full py-4 px-6 bg-[#799aa1] text-white font-semibold rounded-lg hover:bg-[#6a8a91] transition-colors'>
							Complete Order
						</button>

						<div className='flex items-center justify-center gap-2 text-gray-500 text-sm mt-4'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
								/>
							</svg>
							<span>Secure checkout</span>
						</div>
					</form>
				</div>

				{/* Order Summary */}
				<div className='bg-gray-100 p-6 md:p-10 md:w-96'>
					<h2 className='text-xl font-semibold text-gray-700 mb-4'>
						Order Summary
					</h2>
					<div className='space-y-3 mb-6'>
						{cart?.map((item) => (
							<div key={item?.product?.id} className='flex justify-between'>
								<span className='text-gray-600'>
									{item?.product?.name} ({item?.quantity})
								</span>
								<span className='text-gray-800'>
									{toVND(item?.productTotalPrice)}
								</span>
							</div>
						))}
						<div className='flex justify-between'>
							<span className='text-gray-600'>Shipping</span>
							<span className='text-gray-800'>{toVND(SHIPPING_FEE)}</span>
						</div>
					</div>
					<div className='border-t border-gray-200 pt-4 mb-6'>
						<div className='flex justify-between'>
							<span className='font-semibold text-gray-800'>Total</span>
							<span className='font-semibold text-gray-800 text-lg'>
								{toVND(totalPrice + SHIPPING_FEE)}
							</span>
						</div>
					</div>
					<div className='space-y-2'>
						<label className='block text-sm text-gray-600' htmlFor='promoCode'>
							Promo Code
						</label>
						<div className='flex gap-2'>
							<input
								type='text'
								id='promoCode'
								name='promoCode'
								className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#799aa1]'
							/>
							<button
								type='button'
								className='px-4 py-3 bg-[#799aa1] text-white font-semibold rounded-lg hover:bg-[#6a8a91] transition-colors'>
								Apply
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
