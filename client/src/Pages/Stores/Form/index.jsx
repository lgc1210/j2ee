import React, { useState, useEffect, useCallback } from "react";
import { isEmpty, isPhone } from "../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../Components/Toast";

const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../Components/Loading"));

const defaultFields = {
	name: "",
	description: "",
	address: "",
	phone: "",
	open_time: "",
	close_time: "",
	status: "",
	image: "",
};

const Form = ({
	toggle,
	setToggle,
	initialData,
	onSubmit,
	isDisabled = false,
}) => {
	const [fields, setFields] = useState(defaultFields);
	const [file, setFile] = useState(null);
	const [errors, setErrors] = useState({});
	const [pending, setPending] = useState(false);

	useEffect(() => {
		setFields(
			initialData ? { ...defaultFields, ...initialData } : defaultFields
		);
		setErrors({});
	}, [initialData]);

	const handleFieldsChange = (key, value) => {
		if (!isDisabled) {
			setFields((prev) => ({ ...prev, [key]: value }));
			setErrors((prev) => ({ ...prev, [key]: "" }));
		}
	};

	const handleFileChange = (e) => {
		if (!isDisabled && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);
			setFields((prev) => ({ ...prev, image: selectedFile }));
			setErrors((prev) => ({ ...prev, image: "" }));
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
		if (isEmpty(fields.phone)) newErrors.phone = "Phone number is required";
		else if (!isPhone(fields.phone))
			newErrors.phone = "Phone number is invalid";
		if (isEmpty(fields.description))
			newErrors.description = "Description is required";
		if (isEmpty(fields.address)) newErrors.address = "Address is required";
		if (isEmpty(fields.status)) newErrors.status = "Status is required";
		if (isEmpty(fields.open_time))
			newErrors.open_time = "Opening time is required";
		if (isEmpty(fields.close_time))
			newErrors.close_time = "Closing time is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isDisabled || pending) return;

		if (!validateForm()) {
			showToast("Please fix the errors in the form", "error");
			return;
		}

		setPending(true);
		try {
			const data = {
				name: fields.name,
				description: fields.description,
				address: fields.address,
				phone: fields.phone,
				open_time: fields.open_time,
				close_time: fields.close_time,
				status: fields.status,
				image: fields.image || undefined,
			};

			await onSubmit(data);
			handleClose();
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.message || "Error saving store";
			showToast(errorMessage, "error");
		} finally {
			setPending(false);
		}
	};

	const handleClose = () => {
		setFields(defaultFields);
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
									? "Store Information"
									: initialData
									? "Edit Store"
									: "Create Store"}
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
						{!isDisabled && (
							<div className='mb-2'>
								<label className='block mb-1.5 text-sm font-medium text-gray-700'>
									Store Image
								</label>
								<div className='flex items-center gap-2'>
									<input
										type='file'
										accept='image/*'
										onChange={handleFileChange}
										className='w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#435d63]/20 text-sm'
										disabled={isDisabled}
										id='storeImage'
									/>
								</div>
							</div>
						)}

						{(fields.image || fields.imageBase64) && (
							<div className='mb-2'>
								<label className='block mb-1.5 text-sm font-medium text-gray-700'>
									Image Preview
								</label>
								<div className='border border-gray-200 rounded-lg p-2 w-32 h-32'>
									<img
										src={
											file
												? URL.createObjectURL(file)
												: fields.image || fields.imageBase64
										}
										alt={fields.name || "Store Image"}
										className='w-full h-full object-cover rounded-md'
									/>
								</div>
							</div>
						)}

						<FormControl
							type='text'
							placeHolder='Enter store name'
							wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
							inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
							hasLabel
							id='name'
							label='Store Name'
							labelStyle='mb-1.5 text-sm font-medium text-gray-700'
							value={fields.name}
							onChange={(event) =>
								handleFieldsChange("name", event.target.value)
							}
							onType={() => handleFieldsType("name")}
							onBlur={() => {
								if (isEmpty(fields.name)) {
									handleFieldsBlur("name", "Store name is required");
								}
							}}
							hasError={!!errors?.name}
							errorMessage={errors?.name}
							disabled={isDisabled}
						/>

						<FormControl
							type='textarea'
							placeHolder='Enter store description'
							wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
							inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
							hasLabel
							id='description'
							label='Description'
							labelStyle='mb-1.5 text-sm font-medium text-gray-700'
							value={fields.description}
							onChange={(event) =>
								handleFieldsChange("description", event.target.value)
							}
							onType={() => handleFieldsType("description")}
							onBlur={() => {
								if (isEmpty(fields.description)) {
									handleFieldsBlur("description", "Description is required");
								}
							}}
							hasError={!!errors?.description}
							errorMessage={errors?.description}
							disabled={isDisabled}
						/>

						<FormControl
							type='text'
							placeHolder='Enter address'
							wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
							inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
							hasLabel
							id='address'
							label='Address'
							labelStyle='mb-1.5 text-sm font-medium text-gray-700'
							value={fields.address}
							onChange={(event) =>
								handleFieldsChange("address", event.target.value)
							}
							onType={() => handleFieldsType("address")}
							onBlur={() => {
								if (isEmpty(fields.address)) {
									handleFieldsBlur("address", "Address is required");
								}
							}}
							hasError={!!errors?.address}
							errorMessage={errors?.address}
							disabled={isDisabled}
						/>

						<FormControl
							type='text'
							placeHolder='Enter phone number'
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
								}
							}}
							hasError={!!errors?.phone}
							errorMessage={errors?.phone}
							disabled={isDisabled}
						/>

						<div className='!flex flex-wrap gap-4'>
							<div className='flex-1'>
								<FormControl
									type='time'
									wrapInputStyle=' focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
									inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
									hasLabel
									id='open_time'
									label='Opening Time'
									labelStyle='mb-1.5 text-sm font-medium text-gray-700'
									value={fields.open_time}
									onChange={(event) =>
										handleFieldsChange("open_time", event.target.value)
									}
									onType={() => handleFieldsType("open_time")}
									onBlur={() => {
										if (isEmpty(fields.open_time)) {
											handleFieldsBlur("open_time", "Opening time is required");
										}
									}}
									hasError={!!errors?.open_time}
									errorMessage={errors?.open_time}
									disabled={isDisabled}
								/>
							</div>

							<div className='flex-1'>
								<FormControl
									type='time'
									wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
									inputStyle='placeholder:text-gray-400 text-gray-700 placeholder:text-sm'
									hasLabel
									id='close_time'
									label='Closing Time'
									labelStyle='mb-1.5 text-sm font-medium text-gray-700'
									value={fields.close_time}
									onChange={(event) =>
										handleFieldsChange("close_time", event.target.value)
									}
									onType={() => handleFieldsType("close_time")}
									onBlur={() => {
										if (isEmpty(fields.close_time)) {
											handleFieldsBlur(
												"close_time",
												"Closing time is required"
											);
										}
									}}
									hasError={!!errors?.close_time}
									errorMessage={errors?.close_time}
									disabled={isDisabled}
								/>
							</div>
						</div>

						<FormControl
							type='select'
							wrapInputStyle='focus-within:ring-2 focus-within:ring-[#435d63]/20 border-gray-200 rounded-lg'
							inputStyle='text-gray-700'
							hasLabel
							id='status'
							label='Status'
							labelStyle='mb-1.5 text-sm font-medium text-gray-700'
							value={fields.status}
							onChange={(event) =>
								handleFieldsChange("status", event.target.value)
							}
							onType={() => handleFieldsType("status")}
							onBlur={() => {
								if (isEmpty(fields.status)) {
									handleFieldsBlur("status", "Status is required");
								}
							}}
							hasError={!!errors?.status}
							errorMessage={errors?.status}
							disabled={isDisabled}
							options={[
								{ value: "Active", label: "Active" },
								{ value: "Inactive", label: "Inactive" },
							]}
						/>
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
										<span>Update</span>
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
