import React, { useState, useEffect } from "react";
import { isEmail, isEmpty, isPhone } from "../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../Components/Toast";
import RoleService from "../../../Services/role";

const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../Components/Loading"));

const Form = ({
	toggle,
	setToggle,
	initialData,
	onSubmit,
	isDisabled = false,
	usersData,
	roles,
}) => {
	const [fields, setFields] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		role: "",
	});
	const [errors, setErrors] = useState({});
	const [pending, setPending] = useState(false);

	useEffect(() => {
		if (initialData) {
			setFields({
				name: initialData.name || "",
				email: initialData.email || "",
				phone: initialData.phone || "",
				password: "",
				role: initialData.role?.id || "",
			});
			setErrors({});
		} else {
			setFields({
				name: "",
				email: "",
				phone: "",
				password: "",
				role: "",
			});
			setErrors({});
		}
	}, [initialData]);

	const handleFieldsChange = (key, value) => {
		if (!isDisabled) {
			setFields((prev) => ({ ...prev, [key]: value }));
			setErrors((prev) => ({ ...prev, [key]: "" }));
		}
	};

	const handleFieldsType = (key) => {
		if (!isDisabled) {
			setErrors((prev) => ({ ...prev, [key]: "" }));
		}
	};

	const handleFieldsBlur = (key, message) => {
		if (!isDisabled) {
			setErrors((prev) => ({ ...prev, [key]: message }));
		}
	};

	const validateForm = () => {
		let newErrors = {};

		if (isEmpty(fields.name)) newErrors.name = "Name is required";
		if (isEmpty(fields.email)) {
			newErrors.email = "Email is required";
		} else if (!isEmail(fields.email)) {
			newErrors.email = "Email must be a valid @gmail.com address";
		} else if (fields.email && usersData) {
			const emailExists = usersData.some(
				(user) =>
					user.email.trim().toLowerCase() ===
						fields.email.trim().toLowerCase() &&
					(!initialData || user.id !== initialData.id)
			);
			if (emailExists) {
				newErrors.email = "Email already exists";
			}
		}

		if (isEmpty(fields.phone)) {
			newErrors.phone = "Phone number is required";
		} else if (!isPhone(fields.phone)) {
			newErrors.phone = "Phone number must be 10 digits";
		} else if (fields.phone && usersData) {
			const phoneExists = usersData.some(
				(user) =>
					user.phone.trim() === fields.phone.trim() &&
					(!initialData || user.id !== initialData.id)
			);
			if (phoneExists) {
				newErrors.phone = "Phone number already exists";
			}
		}

		if (isEmpty(fields.role)) newErrors.role = "Role is required";

		if (!initialData && isEmpty(fields.password)) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			showToast("Please fix the errors in the form", "error");
			return;
		}

		setPending(true);
		try {
			await onSubmit(fields);
			handleClose();
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.message || "Error saving user";
			showToast(errorMessage, "error");
		} finally {
			setPending(false);
		}
	};

	const handleClose = () => {
		setFields({
			name: "",
			email: "",
			phone: "",
			password: "",
			role: "",
		});
		setErrors({});
		setToggle(false);
	};

	return (
		<>
			<Overlay toggle={toggle} setToggle={handleClose} />
			<section
				className={`
          fixed inset-0 z-40 flex justify-center pt-8 pb-4 overflow-y-auto transition-opacity duration-300
          ${
						toggle
							? "opacity-100 pointer-events-auto"
							: "opacity-0 pointer-events-none"
					}`}>
				<form
					onSubmit={handleSubmit}
					className='bg-white max-w-md w-full rounded-lg shadow-lg p-6 min-h-fit border border-gray-100'>
					<div className='flex items-center justify-between w-full mb-6 border-b border-gray-100 pb-4'>
						<div className='flex items-center'>
							<div className='w-1 h-6 bg-[#435d63] rounded mr-2'></div>
							<p className='font-semibold text-lg text-gray-800'>
								{isDisabled
									? "User Information"
									: initialData
									? "Edit User"
									: "Create User"}
							</p>
						</div>
						<button
							type='button'
							className='text-gray-400 hover:text-[#435d63] transition-colors p-1 rounded-full hover:bg-gray-100'
							onClick={handleClose}>
							<IoClose size={24} />
						</button>
					</div>

					<div className='space-y-5'>
						<FormControl
							type='text'
							placeHolder='Enter Name'
							wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
							inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
							hasLabel
							id='name'
							label='Name'
							labelStyle='mb-1.5 text-sm font-medium text-gray-700'
							value={fields.name}
							onChange={(event) =>
								handleFieldsChange("name", event.target.value)
							}
							onType={() => handleFieldsType("name")}
							onBlur={() => {
								if (isEmpty(fields.name)) {
									handleFieldsBlur("name", "Name is required");
								}
							}}
							hasError={!!errors?.name}
							errorMessage={errors?.name}
							disabled={isDisabled}
						/>

						<FormControl
							type='text'
							placeHolder='Enter phone'
							wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
							inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
							hasLabel
							id='phone'
							label='Phone Number'
							labelStyle='mb-1.5 text-sm font-medium text-gray-700'
							value={fields.phone}
							onChange={(event) =>
								handleFieldsChange("phone", event.target.value)
							}
							onType={() => handleFieldsType("phone")}
							onBlur={() => {
								if (isEmpty(fields.phone)) {
									handleFieldsBlur("phone", "Phone number is required");
								} else if (!/^\d{10}$/.test(fields.phone)) {
									handleFieldsBlur("phone", "Phone number must be 10 digits");
								} else if (
									usersData &&
									usersData.some(
										(user) =>
											user.phone.trim() === fields.phone.trim() &&
											(!initialData || user.id !== initialData.id)
									)
								) {
									handleFieldsBlur("phone", "Phone number already exists");
								}
							}}
							disabled={isDisabled}
							hasError={!!errors?.phone}
							errorMessage={errors?.phone}
						/>

						<FormControl
							type='text'
							placeHolder='Enter email'
							wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
							inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
							hasLabel
							id='email'
							label='Email Address'
							labelStyle='mb-1.5 text-sm font-medium text-gray-700'
							value={fields.email}
							onChange={(event) =>
								handleFieldsChange("email", event.target.value)
							}
							onType={() => handleFieldsType("email")}
							onBlur={() => {
								if (isEmpty(fields.email)) {
									handleFieldsBlur("email", "Email is required");
								} else if (!/^[^\s@]+@gmail\.com$/.test(fields.email)) {
									handleFieldsBlur(
										"email",
										"Email must be a valid @gmail.com address"
									);
								} else if (
									usersData &&
									usersData.some(
										(user) =>
											user.email.trim().toLowerCase() ===
												fields.email.trim().toLowerCase() &&
											(!initialData || user.id !== initialData.id)
									)
								) {
									handleFieldsBlur("email", "Email already exists");
								}
							}}
							hasError={!!errors?.email}
							errorMessage={errors?.email}
							disabled={isDisabled}
						/>

						{!isDisabled && (
							<FormControl
								type='password'
								placeHolder='Enter password'
								wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
								inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
								hasLabel
								id='password'
								label='Password'
								labelStyle='mb-1.5 text-sm font-medium text-gray-700'
								value={fields.password}
								onChange={(event) =>
									handleFieldsChange("password", event.target.value)
								}
								onType={() => handleFieldsType("password")}
								onBlur={() => {
									if (!initialData && isEmpty(fields.password)) {
										handleFieldsBlur("password", "Password is required");
									}
								}}
								hasError={!!errors?.password}
								errorMessage={errors?.password}
								disabled={isDisabled}
							/>
						)}

						<FormControl
							type='select'
							wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
							inputStyle='text-gray-700'
							hasLabel
							id='role'
							label='Role'
							value={fields.role || ""}
							onChange={(event) =>
								handleFieldsChange("role", event.target.value)
							}
							onType={() => handleFieldsType("role")}
							onBlur={() => {
								if (isEmpty(fields.role)) {
									handleFieldsBlur("role", "Role is required");
								}
							}}
							hasError={!!errors?.role}
							errorMessage={errors?.role}
							disabled={isDisabled}
							options={[
								...(Array.isArray(roles) ? roles : []).map((role) => ({
									value: String(role.id),
									label: role.name,
								})),
							]}
						/>

						{!isDisabled && !fields.role && (
							<p className='text-xs text-gray-500 -mt-2 ml-1'>
								Please select a user role from the dropdown
							</p>
						)}
					</div>

					<div className='flex items-center gap-4 mt-8'>
						{!isDisabled && (
							<>
								<button
									type='button'
									className='transition-all duration-300 text-gray-700 w-full py-2.5 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#435d63]/20'
									onClick={handleClose}
									disabled={pending}>
									Cancel
								</button>
								<button
									type='submit'
									className='transition-all duration-300 text-white bg-gradient-to-r from-[#435d63] to-[#2d4046] w-full py-2.5 rounded-lg font-medium hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#435d63]/40'
									disabled={pending}>
									{pending ? (
										<Loading customStyle='flex items-center justify-center' />
									) : (
										<span>{initialData ? "Update" : "Create"}</span>
									)}
								</button>
							</>
						)}
						{isDisabled && (
							<button
								type='button'
								className='transition-all duration-300 text-white bg-gradient-to-r from-[#435d63] to-[#2d4046] w-full py-2.5 rounded-lg font-medium hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#435d63]/40'
								onClick={handleClose}>
								Close
							</button>
						)}
					</div>
				</form>
			</section>
		</>
	);
};

export default Form;
