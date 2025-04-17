import React from "react";
import { isEmpty, isPhone } from "../../../Utils/validation";
import AddressService from "../../../Services/address";
import { useAuth } from "../../../Contexts/Auth";
import { showToast } from "../../../Components/Toast";

const Overlay = React.lazy(() => import("../../../Components/Overlay"));
const FormControl = React.lazy(() => import("../../../Components/FormControl"));
const Loading = React.lazy(() => import("../../../Components/Loading"));

const Form = ({
	toggle,
	setToggle,
	isUpdating = false,
	data = null,
	onSuccess,
}) => {
	const [fields, setFields] = React.useState({
		name: "",
		phone: "",
		is_default: false,
		type: "",
		province: "",
		district: "",
		ward: "",
		detailsAddress: "",
	});
	const [errors, setErrors] = React.useState({});
	const [loading, setLoading] = React.useState(false);
	const [isFetchingProvinces, setIsFetchingProvinces] = React.useState(false);
	const [provinces, setProvinces] = React.useState([]);
	const [districts, setDistricts] = React.useState([]);
	const [wards, setWards] = React.useState([]);
	const { user } = useAuth();

	React.useEffect(() => {
		if (isUpdating && data && provinces.length > 0) {
			try {
				const address = data?.address?.split(", ");
				const provinceName = address[address.length - 1];
				const districtName = address[address.length - 2];
				const wardName = address[address.length - 3];
				const detailsAddress = address[address.length - 4];

				const province = provinces.find((p) => p.name === provinceName);

				setFields({
					id: data?.id,
					name: data?.name,
					phone: data?.phone,
					is_default: data?.is_default,
					type: data?.type,
					province: province?.code.toString(), // Store as code, not name
					district: "", // Will be populated once districts load
					ward: "", // Will be populated once wards load
					detailsAddress,
					// Store original names for reference
					provinceName,
					districtName,
					wardName,
				});
			} catch (error) {
				console.log("Error parsing address data:", error);
			}
		}
	}, [data, isUpdating, provinces]);

	// Add another effect to set district when provinces and province are loaded
	React.useEffect(() => {
		if (
			isUpdating &&
			fields.provinceName &&
			fields.province &&
			districts.length > 0
		) {
			const district = districts.find((d) => d.name === fields.districtName);
			if (district) {
				setFields((prev) => ({
					...prev,
					district: district.code.toString(),
				}));
			}
		}
	}, [
		fields.province,
		districts,
		fields.provinceName,
		isUpdating,
		fields.districtName,
	]);

	// Add another effect for wards
	React.useEffect(() => {
		if (
			isUpdating &&
			fields.districtName &&
			fields.district &&
			wards.length > 0
		) {
			const ward = wards.find((w) => w.name === fields.wardName);
			if (ward) {
				setFields((prev) => ({
					...prev,
					ward: ward.code.toString(),
				}));
			}
		}
	}, [
		fields.district,
		wards,
		fields.districtName,
		isUpdating,
		fields.wardName,
	]);

	const fetchProvinces = React.useCallback(async () => {
		try {
			setIsFetchingProvinces(true);
			const response = await AddressService.getProvinces();
			if (response.status === 200) {
				setProvinces(response.data);
			}
		} catch (error) {
			console.log("Errors occur while fetching provinces", error.message);
		} finally {
			setIsFetchingProvinces(false);
		}
	}, []);

	// Get provinces
	React.useEffect(() => {
		fetchProvinces();
	}, [fetchProvinces]);

	const memoizedDistricts = React.useMemo(
		() =>
			provinces.find((p) => p.code === parseInt(fields.province))?.districts ||
			[],
		[fields.province, provinces]
	);

	const memoizedWards = React.useMemo(
		() =>
			districts.find((d) => d.code === parseInt(fields.district))?.wards || [],
		[fields.district, districts]
	);

	React.useEffect(() => {
		setDistricts(memoizedDistricts);
	}, [memoizedDistricts]);

	React.useEffect(() => {
		setWards(memoizedWards);
	}, [memoizedWards]);

	const handleFieldsChange = (key, value) => {
		setFields((prev) => ({ ...prev, [key]: value }));
		!isEmpty(value) && handelFieldsBlur(key, "");
	};

	const handleFieldsType = (key) => {
		setErrors((prev) => ({ ...prev, [key]: "" }));
	};

	const handelFieldsBlur = (key, message) => {
		setErrors((prev) => ({ ...prev, [key]: message }));
	};

	const validateFields = React.useCallback(() => {
		const errs = {};

		const requiredFields = {
			name: "Full name is required",
			phone: "Phone number is required",
			province: "Province is required",
			district: "District is required",
			ward: "Ward is required",
			detailsAddress: "Details address is required",
		};

		Object.entries(requiredFields).forEach(([key, message]) => {
			if (isEmpty(fields[key])) {
				errs[key] = message;
			}
			if (!isPhone(fields["phone"])) {
				errs["phone"] = "Phone number is invalid";
			}
		});

		setErrors(errs);

		return Object.keys(errs).length === 0;
	}, [fields]);

	const reset = () => {
		setFields({
			name: "",
			phone: "",
			is_default: false,
			type: "",
			province: "",
			district: "",
			ward: "",
			detailsAddress: "",
		});
		setToggle(false);
		setLoading(false);
		setErrors({});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateFields()) {
			return;
		}

		try {
			setLoading(true);
			const provinceName = provinces?.find(
				(p) => p?.code === parseInt(fields?.province)
			);
			const districtName = districts?.find(
				(d) => d?.code === parseInt(fields?.district)
			);
			const wardName = wards?.find((w) => w?.code === parseInt(fields?.ward));
			const address = `${fields?.detailsAddress}, ${wardName?.name}, ${districtName?.name}, ${provinceName?.name}`;

			const payload = {
				user: { id: user?.id },
				name: fields["name"],
				phone: fields["phone"],
				is_default: fields["is_default"],
				type: fields["type"],
				address,
			};

			if (!isUpdating) {
				const response = await AddressService.create(payload);
				if (response.status === 201) {
					showToast("Address created successfully");
					onSuccess();
					reset();
				}
			} else {
				const response = await AddressService.update(fields?.id, payload);
				if (response.status === 200) {
					showToast("Address updated successfully");
					onSuccess();
					reset();
				}
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
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
			<Overlay toggle={toggle} setToggle={setToggle} />
			<div
				className={`fixed inset-0 flex items-center justify-center z-30 px-4 transition ${
					toggle
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}>
				{isFetchingProvinces ? (
					<Loading
						size='h-16 w-16'
						customStyle='w-full h-screen flex flex-col items-center justify-center'
					/>
				) : (
					<form
						className='bg-white w-full max-w-lg rounded shadow p-6 max-h-[90vh] overflow-y-auto'
						onSubmit={handleSubmit}>
						<div className='mb-4'>
							<p className='text-xl font-medium'>
								{isUpdating ? "Update address" : "New address"}
							</p>
						</div>
						<div className='flex flex-col md:flex-row items-start md:items-start gap-4 mb-4'>
							<div className='w-full'>
								<FormControl
									type='text'
									placeHolder='Enter full name'
									wrapInputStyle='!items-start w-full rounded-sm !border-black/20 focus-within:!border-black focus-within:shadow'
									inputStyle='text-black placeholder:font-serif w-full !py-2 !px-4'
									hasLabel
									label='Fullname'
									id='name'
									value={fields?.name}
									labelStyle='mb-1 font-serif'
									onChange={(event) =>
										handleFieldsChange("name", event.target.value)
									}
									onType={() => handleFieldsType("name")}
									onBlur={() => {
										if (isEmpty(fields.name))
											handelFieldsBlur("name", "Full name is required");
									}}
									hasError={errors?.name}
									errorMessage={errors?.name}
								/>
							</div>
							<div className='w-full'>
								<FormControl
									type='text'
									placeHolder='Enter phone number'
									wrapInputStyle='!items-start w-full rounded-sm !border-black/20 focus-within:!border-black focus-within:shadow'
									inputStyle='text-black placeholder:font-serif w-full !py-2 !px-4'
									hasLabel
									label='Phone number'
									id='phone'
									value={fields?.phone}
									labelStyle='mb-1 font-serif'
									onChange={(event) =>
										handleFieldsChange("phone", event.target.value)
									}
									onType={() => handleFieldsType("phone")}
									onBlur={() => {
										isEmpty(fields.phone) &&
											handelFieldsBlur("phone", "Phone number is required");
										!isPhone(fields.phone) &&
											handelFieldsBlur("phone", "Phone number is invalid");
									}}
									hasError={errors?.phone}
									errorMessage={errors?.phone}
								/>
							</div>
						</div>
						<div className='flex flex-wrap sm:flex-nowrap w-full items-start gap-2'>
							<div className='mb-4 w-full'>
								<FormControl
									type='select'
									options={provinces?.map((province) => ({
										label: province?.name,
										value: province?.code,
									}))}
									placeHolder='Province'
									wrapInputStyle='!items-start w-full rounded-sm !border-black/20 focus-within:!border-black focus-within:shadow'
									inputStyle='text-black placeholder:font-serif w-full !py-2 !px-4'
									id='province'
									value={fields?.province}
									labelStyle='mb-1 font-serif'
									onChange={(event) =>
										handleFieldsChange("province", event.target.value)
									}
									onType={() => handleFieldsType("province")}
									onBlur={() =>
										isEmpty(fields.province) &&
										handelFieldsBlur("province", "Province is required")
									}
									hasError={errors?.province}
									errorMessage={errors?.province}
								/>
							</div>
							<div className='mb-4 w-full'>
								<FormControl
									type='select'
									options={districts?.map((district) => ({
										label: district?.name,
										value: district?.code,
									}))}
									placeHolder='District'
									wrapInputStyle='!items-start w-full rounded-sm !border-black/20 focus-within:!border-black focus-within:shadow'
									inputStyle='text-black placeholder:font-serif w-full !py-2 !px-4'
									id='district'
									value={fields?.district}
									labelStyle='mb-1 font-serif'
									onChange={(event) =>
										handleFieldsChange("district", event.target.value)
									}
									onType={() => handleFieldsType("district")}
									onBlur={() =>
										isEmpty(fields.district) &&
										handelFieldsBlur("district", "District is required")
									}
									hasError={errors?.district}
									errorMessage={errors?.district}
								/>
							</div>
							<div className='mb-4 w-full'>
								<FormControl
									type='select'
									options={wards?.map((wards) => ({
										label: wards?.name,
										value: wards?.code,
									}))}
									placeHolder='Ward'
									wrapInputStyle='!items-start w-full rounded-sm !border-black/20 focus-within:!border-black focus-within:shadow'
									inputStyle='text-black placeholder:font-serif w-full !py-2 !px-4'
									id='ward'
									value={fields?.ward}
									labelStyle='mb-1 font-serif'
									onChange={(event) =>
										handleFieldsChange("ward", event.target.value)
									}
									onType={() => handleFieldsType("ward")}
									onBlur={() =>
										isEmpty(fields.ward) &&
										handelFieldsBlur("ward", "Ward is required")
									}
									hasError={errors?.ward}
									errorMessage={errors?.ward}
								/>
							</div>
						</div>
						<div className='mb-4'>
							<FormControl
								type='textarea'
								rows={2}
								placeHolder='Enter details address'
								wrapInputStyle='!items-start w-full rounded-sm !border-black/20 focus-within:!border-black focus-within:shadow'
								inputStyle='text-black placeholder:font-serif w-full !py-2 !px-4'
								hasLabel
								label='Details address'
								id='details-address'
								value={fields?.detailsAddress}
								labelStyle='mb-1 font-serif'
								onChange={(event) =>
									handleFieldsChange("detailsAddress", event.target.value)
								}
								onType={() => handleFieldsType("detailsAddress")}
								onBlur={() => {
									if (isEmpty(fields.detailsAddress))
										handelFieldsBlur(
											"detailsAddress",
											"Details address is required"
										);
								}}
								hasError={errors?.detailsAddress}
								errorMessage={errors?.detailsAddress}
							/>
						</div>
						<div className='mb-4'>
							<p className='mb-2'>Address type:</p>
							<span className='flex items-center gap-4'>
								<button
									type='button'
									value='home'
									className={`text-sm uppercase shadow-sm py-2 px-4 border border-black/20 rounded-sm bg-white ${
										fields.type === "home"
											? "text-[#274b609f] border-[#274b609f]"
											: ""
									}`}
									onClick={() => handleFieldsChange("type", "home")}>
									Home
								</button>
								<button
									type='button'
									value='office'
									className={`text-sm uppercase shadow-sm py-2 px-4 border border-black/20 rounded-sm bg-white ${
										fields.type === "office"
											? "text-[#274b609f] border-[#274b609f]"
											: ""
									}`}
									onClick={() => handleFieldsChange("type", "office")}>
									Office
								</button>
							</span>
						</div>
						<div className='flex items-center gap-2 mb-6'>
							<input
								type='checkbox'
								id='default_address'
								checked={fields.is_default}
								onChange={() =>
									handleFieldsChange("is_default", !fields?.is_default)
								}
							/>
							<label htmlFor='default_address' className='text-black/70'>
								Set as default address
							</label>
						</div>
						<div className='w-full flex items-center justify-end'>
							<button
								type='button'
								onClick={() => reset()}
								disabled={loading}
								className={`px-10 py-1.5 hover:bg-black/5 text-black/70 ${
									loading ? "opacity-70 pointer-events-none" : ""
								}`}>
								Cancel
							</button>
							<button
								type='submit'
								disabled={loading}
								className={`px-10 py-1.5 bg-[#274b609f] text-white  ${
									loading
										? "opacity-70 hover:opacity-70 pointer-events-none"
										: "opacity-100 hover:opacity-90 pointer-events-auto"
								}`}>
								{loading ? (
									<Loading
										size='h-5 w-5'
										customStyle='w-full flex flex-col items-center justify-center'
									/>
								) : (
									<p>Done</p>
								)}
							</button>
						</div>
					</form>
				)}
			</div>
		</React.Suspense>
	);
};

export default React.memo(Form);
