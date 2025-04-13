import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { useAuth } from "../../Contexts/Auth";
import { isEmail, isEmpty, isPhone } from "../../Utils/validation";
import { IoClose } from "react-icons/io5";
import userService from "../../Services/user";
import { showToast } from "../../Components/Toast";
import AddressService from "../../Services/address";

const Loading = React.lazy(() => import("../../Components/Loading"));
const FormControl = React.lazy(() => import("../../Components/FormControl"));
const Form = React.lazy(() => import("./Form"));
const ConfirmPopup = React.lazy(() => import("../../Components/ConfirmPopup"));

const Profile = () => {
	const { logout, user, setUser } = useAuth();
	const [fields, setFields] = React.useState({
		id: user["id"] || "",
		name: user["name"] || "",
		phone: user["phone"] || "",
		email: user["email"] || "",
		createdAt: user["created_at"] || "",
	});
	const [isEditingUser, setIsEditingUser] = React.useState(false);
	const [errors, setErrors] = React.useState({});
	const [showForm, setShowForm] = React.useState(false);
	const [showConfimPopup, setShowConfirmPopup] = React.useState({
		addressId: null,
		isShow: false,
	});
	const [addressList, setAddressList] = React.useState([]);
	const [isUpdatingAddress, setIsUpdatingAddress] = React.useState(false);
	const [selectedAddress, setSelectedAddress] = React.useState(null);

	const memoizedAddressList = React.useMemo(() => addressList, [addressList]);

	const fetchAddressList = React.useCallback(async () => {
		try {
			const response = await AddressService.getByUserId(user?.id);
			if (response.status === 200) {
				setAddressList(response?.data);
			}
		} catch (error) {}
	}, [user?.id]);

	const isMounted = React.useRef(true);
	React.useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	React.useEffect(() => {
		fetchAddressList();
	}, [fetchAddressList]);

	const reset = React.useCallback(() => {
		setFields({
			id: user["id"] || "",
			name: user["name"] || "",
			phone: user["phone"] || "",
			email: user["email"] || "",
			createdAt: user["created_at"] || "",
		});
		setErrors({});
	}, [user]);

	React.useEffect(() => {
		reset();
	}, [isEditingUser, reset, user]);

	const handleFieldsChange = (key, value) => {
		setFields((prev) => ({ ...prev, [key]: value }));
	};

	const handleFieldsType = (key) => {
		setErrors((prev) => ({ ...prev, [key]: "" }));
	};

	const handleFieldsBlur = (key, message) => {
		setErrors((prev) => ({ ...prev, [key]: message }));
	};

	const validateFields = () => {
		const errs = {};

		if (isEmpty(fields.name)) {
			errs.name = "Full name is required";
		}

		if (isEmpty(fields.email)) {
			errs.email = "Email is required";
		} else if (!isEmail(fields.email)) {
			errs.email = "Email is invalid";
		}

		if (isEmpty(fields.phone)) {
			errs.phone = "Phone number is required";
		} else if (!isPhone(fields.phone)) {
			errs.phone = "Phone number is invalid";
		}

		setErrors(errs);

		return Object.keys(errs).length === 0;
	};

	// Update user's information
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateFields()) {
			return;
		}

		try {
			const response = await userService.updateUser(fields["id"], fields);
			if (response.status === 200) {
				showToast("User updated successfully");
				setIsEditingUser(false);
				setUser((prev) => ({
					...prev,
					...fields,
				}));
				reset();
			}
		} catch (error) {
			if (error.response.status === 409) {
				showToast(error.response?.data, "error");
			} else {
				showToast("Internal Server Error", "error");
			}
		}
	};

	const handleDeleteAddress = async () => {
		try {
			const response = await AddressService.delete(showConfimPopup.addressId);
			if (response?.status === 200) {
				showToast("Address deleted successfully");
				reset();
				fetchAddressList();
				setShowConfirmPopup((prev) => ({
					...prev,
					addressId: null,
					isShow: false,
				}));
			}
		} catch (error) {
			showToast("Error occurs while deleting the address");
		}
	};

	const handleSetDefault = async (id) => {
		try {
			const response = await AddressService.setDefault(id, {
				user: { id: user?.id },
			});
			if (response.status === 200) {
				showToast("Address set as default");
			}
		} catch (error) {
			showToast("Error occurs while setting default address", "error");
		}
	};

	const handleClickedUpdate = (address) => {
		setSelectedAddress(address);
		setIsUpdatingAddress(true);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setSelectedAddress(null);
		setIsUpdatingAddress(false);
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
			<section className='flex-grow bg-white rounded-md shadow-md p-4 max-h-full h-fit'>
				<div className=''>
					<div>
						<p className='font-bold mb-8'>My Profile</p>
					</div>

					<div className='flex flex-col gap-4'>
						{/* Personal Information */}
						<div className='p-4 rounded-md border border-black/10'>
							<div className='flex items-center justify-between'>
								<p className='font-semibold'>Personal Information</p>
								{isEditingUser ? (
									<button
										className='text-black/50 hover:text-black hover:border-black flex items-center gap-2 border border-black/10 rounded-full py-2 px-4'
										onClick={() => setIsEditingUser(false)}>
										<IoClose size={16} />
									</button>
								) : (
									<button
										className='text-black/50 hover:text-black hover:border-black flex items-center gap-2 border border-black/10 rounded-full py-2 px-4'
										onClick={() => setIsEditingUser(true)}>
										<p className='text-sm'>Edit</p>
										<AiOutlineEdit size={16} />
									</button>
								)}
							</div>

							<table>
								<tbody>
									<tr>
										<td className='pr-32 pb-6'>
											<div className='flex flex-col gap-1'>
												<p className='text-black/60 text-sm font-semibold'>
													Full Name
												</p>
												{isEditingUser ? (
													<div>
														<FormControl
															type='text'
															placeHolder='Enter your full name'
															wrapInputStyle='!border-black/30 rounded'
															inputStyle='text-sm text-black placeholder:font-serif !py-1.5 !px-4'
															id='name'
															value={fields["name"]}
															onChange={(event) =>
																handleFieldsChange("name", event.target.value)
															}
															onType={() => handleFieldsType("name")}
															onBlur={() =>
																isEmpty(fields.phone) &&
																handleFieldsBlur(
																	"phone",
																	"Phone number is required"
																)
															}
															hasError={errors?.name}
															errorMessage={errors?.name}
														/>
													</div>
												) : (
													<p className='font-semibold'>{user?.name}</p>
												)}
											</div>
										</td>
										<td className='pr-32 pb-6'>
											<div className='flex flex-col gap-1'>
												<p className='text-black/60 text-sm font-semibold'>
													Phone
												</p>
												{isEditingUser ? (
													<div>
														<FormControl
															type='text'
															placeHolder='Enter your phone'
															wrapInputStyle='!border-black/30 rounded'
															inputStyle='text-sm text-black placeholder:font-serif !py-1.5 !px-4'
															id='phone'
															value={fields["phone"]}
															onChange={(event) =>
																handleFieldsChange("phone", event.target.value)
															}
															onType={() => handleFieldsType("phone")}
															onBlur={() => {
																if (isEmpty(fields.phone))
																	handleFieldsBlur(
																		"phone",
																		"Phone is required"
																	);
																else if (!isPhone(fields.phone))
																	handleFieldsBlur("phone", "Phone is invalid");
															}}
															hasError={errors?.phone}
															errorMessage={errors?.phone}
														/>
													</div>
												) : (
													<p className='font-semibold'>{user?.phone}</p>
												)}
											</div>
										</td>
									</tr>
									<tr>
										<td className='pr-32 pb-6'>
											<div className='flex flex-col gap-1'>
												<p className='text-black/60 text-sm font-semibold'>
													Email
												</p>
												{isEditingUser ? (
													<div>
														<FormControl
															type='text'
															placeHolder='Enter your email'
															wrapInputStyle='!border-black/30 rounded'
															inputStyle='text-sm text-black placeholder:font-serif !py-1.5 !px-4'
															id='email'
															value={fields["email"]}
															onChange={(event) =>
																handleFieldsChange("email", event.target.value)
															}
															onType={() => handleFieldsType("email")}
															onBlur={() => {
																if (isEmpty(fields.email))
																	handleFieldsBlur(
																		"email",
																		"Email is required"
																	);
																else if (!isEmail(fields.email))
																	handleFieldsBlur("email", "Email is invalid");
															}}
															hasError={errors?.email}
															errorMessage={errors?.email}
														/>
													</div>
												) : (
													<p className='font-semibold'>{user?.email}</p>
												)}
											</div>
										</td>
										<td className='pr-32 pb-6'>
											<div className='flex flex-col gap-1'>
												<p className='text-black/60 text-sm font-semibold'>
													Created At
												</p>
												<p className='font-semibold'>{user?.created_at}</p>
											</div>
										</td>
									</tr>
									{isEditingUser ? (
										<tr>
											<td>
												<button
													className='transition hover:scale-[0.98] text-sm shadow shadow-[#274b609f] hover:shadow-none rounded bg-[#274b609f] text-white py-2 px-6 font-semibold'
													onClick={handleSubmit}>
													Save
												</button>
											</td>
										</tr>
									) : (
										<></>
									)}
								</tbody>
							</table>
						</div>

						{/* Addresses */}
						<div className='p-4 rounded-md border border-black/10'>
							<div className='flex items-center justify-between pb-4'>
								<p className='font-semibold'>Addresses</p>
								<button
									className='text-black/50 hover:text-black hover:border-black flex items-center gap-2 border border-black/10 rounded-full py-2 px-4'
									onClick={() => setShowForm(true)}>
									<p className='text-sm'>Add</p>
									<FiPlus size={16} />
								</button>
							</div>

							{/* List of address */}
							<ul className=''>
								{memoizedAddressList?.map((a) => {
									return (
										<li
											key={a?.id}
											className='flex items-center justify-between py-4 border-t border-black/10'>
											<div>
												<span className='flex items-center justify-start'>
													<p className='font-semibold'>{a?.name}</p>
													{/* Divider */}
													<span className='mx-2 w-[1px] h-6 bg-black/10'></span>
													<p className='text-black/60 text-sm'>{a?.phone}</p>
												</span>
												<div>
													<p className='text-black/60 text-sm'>{a?.address}</p>
												</div>
												{a?.is_default && (
													<span className='text-xs text-[#435d63] border border-[#435d63] px-1'>
														Default
													</span>
												)}
											</div>
											<div className='flex flex-col items-end gap-4'>
												<span className='flex items-center gap-2'>
													<p
														className='text-sm cursor-pointer text-[#435d63]'
														onClick={() => handleClickedUpdate(a)}>
														Update
													</p>
													{!a?.is_default && (
														<p
															className='text-sm cursor-pointer text-[#435d63]'
															onClick={() =>
																setShowConfirmPopup((prev) => ({
																	...prev,
																	addressId: a?.id,
																	isShow: true,
																}))
															}>
															Delete
														</p>
													)}
												</span>
												<p
													className='text-sm cursor-pointer border border-black/20 py-0.5 px-4 hover:bg-gray-300/15'
													onClick={() => handleSetDefault(a?.id)}>
													Set default
												</p>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>

					<div className='w-full mt-4'>
						<p
							className='text-sm cursor-pointer rounded w-fit ml-auto py-2 px-4 text-white bg-black/80'
							onClick={logout}>
							Log out
						</p>
					</div>
				</div>
			</section>

			<Form
				toggle={showForm}
				setToggle={handleCloseForm}
				isUpdating={isUpdatingAddress}
				data={selectedAddress}
				onSuccess={fetchAddressList}
			/>

			<ConfirmPopup
				toggle={showConfimPopup.isShow}
				setToggle={() =>
					setShowConfirmPopup((prev) => ({ ...prev, isShow: false }))
				}
				title='Are you sure you want to delete this address?'
				message='This action can be undone.'
				okButtonText='Accept'
				cancelButtonText='Cancel'
				onOk={handleDeleteAddress}
				onCancel={() =>
					setShowConfirmPopup((prev) => ({ ...prev, isShow: false }))
				}
			/>
		</React.Suspense>
	);
};

export default Profile;
