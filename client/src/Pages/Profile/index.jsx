import React, {
	useState,
	useEffect,
	useCallback,
	Suspense,
	useRef,
} from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../Contexts/Auth";
import { isEmail, isEmpty, isPhone } from "../../Utils/validation";
import userService from "../../Services/user";
import AddressService from "../../Services/address";
import { showToast } from "../../Components/Toast";

import AddressList from "./AddressList";
const Loading = React.lazy(() => import("../../Components/Loading"));
const FormControl = React.lazy(() => import("../../Components/FormControl"));
const Form = React.lazy(() => import("./Form"));
const ConfirmPopup = React.lazy(() => import("../../Components/ConfirmPopup"));

const Profile = () => {
	const { logout, user, setUser } = useAuth();
	const [fields, setFields] = useState({
		id: user?.id || "",
		name: user?.name || "",
		phone: user?.phone || "",
		email: user?.email || "",
		createdAt: user?.created_at || "",
	});
	const [isEditingUser, setIsEditingUser] = useState(false);
	const [errors, setErrors] = useState({});
	const [showForm, setShowForm] = useState(false);
	const [addressList, setAddressList] = useState([]);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
	const [showConfimPopup, setShowConfirmPopup] = useState({
		addressId: null,
		isShow: false,
	});
	const listRef = useRef();

	const reset = useCallback(() => {
		setFields({
			id: user?.id || "",
			name: user?.name || "",
			phone: user?.phone || "",
			email: user?.email || "",
			createdAt: user?.created_at || "",
		});
		setErrors({});
	}, [user]);

	const fetchAddressList = useCallback(async () => {
		try {
			const response = await AddressService.getAllByUserId(user?.id);
			if (response.status === 200) {
				setAddressList(response?.data?.addresses);
			}
		} catch (error) {}
	}, [user?.id]);

	useEffect(() => {
		reset();
	}, [isEditingUser, reset, user]);

	useEffect(() => {
		if (user?.id) {
			fetchAddressList();
		}
	}, [fetchAddressList, user?.id]);

	const handleFieldsChange = (key, value) => {
		setFields((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: "" }));
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

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateFields()) {
			return;
		}

		try {
			const response = await userService.updateUser(fields.id, fields);
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
			if (error.response?.status === 409) {
				showToast(error.response?.data, "error");
			} else {
				showToast("Internal Server Error", "error");
			}
		}
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setSelectedAddress(null);
		setIsUpdatingAddress(false);
	};

	const handleClickedUpdate = (address) => {
		setSelectedAddress(address);
		setIsUpdatingAddress(true);
		setShowForm(true);
	};

	const handleSetDefault = async (id) => {
		try {
			const response = await AddressService.setDefault(id, {
				user: { id: user?.id },
			});
			if (response.status === 200) {
				showToast("Address set as default");
				fetchAddressList();
				listRef.current?.();
			}
		} catch (error) {
			showToast("Error occurs while setting default address", "error");
		}
	};

	const handleDeleteAddress = async () => {
		try {
			const response = await AddressService.delete(showConfimPopup.addressId);
			if (response?.status === 200) {
				showToast("Address deleted successfully");
				fetchAddressList();
				setShowConfirmPopup((prev) => ({
					...prev,
					addressId: null,
					isShow: false,
				}));
				listRef.current?.();
			}
		} catch (error) {
			showToast("Error occurs while deleting the address", "error");
		}
	};

	const memoizedAddressList = React.useMemo(() => addressList, [addressList]);

	const renderPersonalInfoField = (label, value, fieldName) => (
		<td className='pr-32 pb-6'>
			<div className='flex flex-col gap-1'>
				<p className='text-black/60 text-sm font-semibold'>{label}</p>
				{isEditingUser && fieldName !== "createdAt" ? (
					<FormControl
						type='text'
						placeHolder={`Enter your ${fieldName.toLowerCase()}`}
						wrapInputStyle='!border-black/30 rounded'
						inputStyle='text-sm text-black placeholder:font-serif !py-1.5 !px-4'
						id={fieldName}
						value={fields[fieldName]}
						onChange={(event) =>
							handleFieldsChange(fieldName, event.target.value)
						}
						onType={() => setErrors((prev) => ({ ...prev, [fieldName]: "" }))}
						onBlur={() => {
							if (isEmpty(fields[fieldName])) {
								setErrors((prev) => ({
									...prev,
									[fieldName]: `${label} is required`,
								}));
							} else if (fieldName === "email" && !isEmail(fields.email)) {
								setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
							} else if (fieldName === "phone" && !isPhone(fields.phone)) {
								setErrors((prev) => ({
									...prev,
									phone: "Phone number is invalid",
								}));
							}
						}}
						hasError={errors?.[fieldName]}
						errorMessage={errors?.[fieldName]}
					/>
				) : (
					<p className='font-semibold'>{value}</p>
				)}
			</div>
		</td>
	);

	return (
		<Suspense
			fallback={
				<Loading
					size='h-16 w-16'
					customStyle='w-full h-screen flex flex-col items-center justify-center'
					hasLoadingText
				/>
			}>
			<section className='flex-grow bg-white rounded-md shadow-md p-4 max-h-full h-fit'>
				<div>
					<div>
						<p className='font-bold mb-8'>My Profile</p>
					</div>

					<div className='flex flex-col gap-4'>
						{/* Personal Information */}
						<div className='p-4 rounded-md border border-black/10'>
							<div className='flex items-center justify-between mb-4'>
								<p className='font-semibold'>Personal Information</p>
								<button
									className='text-black/50 hover:text-black hover:border-black flex items-center gap-2 border border-black/10 rounded-full py-2 px-4'
									onClick={() => setIsEditingUser(!isEditingUser)}>
									{isEditingUser ? (
										<IoClose size={16} />
									) : (
										<>
											<p className='text-sm'>Edit</p>
											<AiOutlineEdit size={16} />
										</>
									)}
								</button>
							</div>

							<table className='w-full'>
								<tbody>
									<tr>
										{renderPersonalInfoField("Full Name", user?.name, "name")}
										{renderPersonalInfoField("Phone", user?.phone, "phone")}
									</tr>
									<tr>
										{renderPersonalInfoField("Email", user?.email, "email")}
										{renderPersonalInfoField(
											"Created At",
											user?.created_at,
											"createdAt"
										)}
									</tr>
									{isEditingUser && (
										<tr>
											<td colSpan={2} className='pt-4'>
												<button
													className='transition hover:scale-[0.98] text-sm shadow shadow-[#274b609f] hover:shadow-none rounded bg-[#274b609f] text-white py-2 px-6 font-semibold'
													onClick={handleSubmit}>
													Save
												</button>
											</td>
										</tr>
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
							<AddressList
								addressList={memoizedAddressList}
								handleClickedUpdate={handleClickedUpdate}
								handleSetDefault={handleSetDefault}
								setShowConfirmPopup={setShowConfirmPopup}
								fetchAddressList={(callback) => {
									listRef.current = callback;
								}}
							/>
						</div>
					</div>

					<div className='w-full mt-4'>
						<button
							className='text-sm cursor-pointer rounded w-fit ml-auto py-2 px-4 text-white bg-black/80 hover:bg-black'
							onClick={logout}>
							Log out
						</button>
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
				message='This action cannot be undone.'
				okButtonText='Delete'
				cancelButtonText='Cancel'
				onOk={handleDeleteAddress}
				onCancel={() =>
					setShowConfirmPopup((prev) => ({ ...prev, isShow: false }))
				}
			/>
		</Suspense>
	);
};

export default React.memo(Profile);
