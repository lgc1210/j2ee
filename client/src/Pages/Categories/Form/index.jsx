import React, { useState, useEffect } from "react";
import { isEmpty } from "../../../Utils/validation";
import { IoClose } from "react-icons/io5";
import { showToast } from "../../../Components/Toast";

const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Overlay = React.lazy(() => import("../../../Components/Overlay"));
const Loading = React.lazy(() => import("../../../Components/Loading"));

const defaultFields = {
	name: "",
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
		if (initialData) {
			// Properly merge the initial data with default fields
			setFields({
				...defaultFields,
				...initialData,
			});
		} else {
			setFields(defaultFields);
		}
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

		if (isEmpty(fields.status)) newErrors.status = "Status is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			showToast("Please fix the errors in the form", "error");
			return;
		}

		try {
			setPending(true);

			// Important: Pass the ID from the initial data if we're editing
			const data = {
				name: fields.name,
				status: fields.status,
				image: file,
				// Keep the ID if this is an edit operation
				id: initialData?.id,
			};

			await onSubmit(data);
			handleClose();
		} catch (error) {
			console.error("Form submission error:", error);
		} finally {
			setPending(false);
		}
	};

	const handleClose = () => {
		setFields(defaultFields);
		setErrors({});
		if (file) {
			URL.revokeObjectURL(file);
		}
		setFile(null);
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
									? "Category Information"
									: initialData
									? "Edit Category"
									: "Create Category"}
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
							<div className='mb-1'>
								<label className='block mb-1.5 text-sm font-medium text-gray-700'>
									Category Image
								</label>
								<input
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									className='w-full p-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#435d63]/20'
									disabled={isDisabled}
								/>
							</div>
						)}

						{fields.imageBase64 && (
							<div className='mb-4'>
								<label className='block mb-1.5 text-sm font-medium text-gray-700'>
									Image Preview
								</label>
								<div className='mt-1 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-2'>
									<img
										src={fields.imageBase64}
										alt={fields.name || "Category Image"}
										className='h-32 w-auto object-contain rounded-md'
										onError={(e) => {
											e.target.src =
												"https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg";
											console.error("Image not found");
										}}
									/>
								</div>
							</div>
						)}

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

						{!isDisabled && !fields.status && (
							<p className='text-xs text-gray-500 -mt-2 ml-1'>
								Please select a category status from the dropdown
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
