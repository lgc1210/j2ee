import React from "react";

const FormControl = ({
	wrapInputStyle,
	inputStyle,
	iconStyle,
	iconSize,
	Icon,
	type,
	placeHolder,
	hasButton = false,
	buttonText,
	buttonStyle,
	hasLabel = false,
	labelStyle,
	id,
	label,
	hasError,
	errorMessage,
	onChange,
	onBlur,
	onType,
	onClick,
	value,
	rows = 6, // Default rows for text area
	options = [], // Options for select input
}) => {
	const defaultFormControlStyle =
		"w-full h-full py-4 px-6 bg-transparent outline-none";

	return (
		<>
			{hasLabel && (
				<label
					htmlFor={id}
					className={`block text-sm/6 font-medium text-gray-900 ${labelStyle}`}>
					{label}
				</label>
			)}
			<div
				className={`border border-zinc-500 flex items-center ${wrapInputStyle}`}>
				{type === "textarea" ? (
					<textarea
						id={id}
						placeholder={placeHolder}
						className={`${defaultFormControlStyle} ${inputStyle}`}
						onChange={onChange}
						onBlur={onBlur}
						onInput={onType}
						value={value}
						rows={rows}></textarea>
				) : type === "select" ? (
					<select
						id={id}
						className={`${defaultFormControlStyle} ${inputStyle}`}
						onChange={onChange}
						onBlur={onBlur}
						value={value}>
						<option value={null} className='text-black/50'>
							Select
						</option>
						{options.map((option, index) => {
							return (
								<option key={index} value={option.value}>
									{option.label}
								</option>
							);
						})}
					</select>
				) : (
					<input
						type={type}
						id={id}
						placeholder={placeHolder}
						className={`${defaultFormControlStyle} ${inputStyle}`}
						onChange={onChange}
						onBlur={onBlur}
						onInput={onType}
						value={value}
					/>
				)}
				{hasButton && (
					<button className={`${buttonStyle}`} onClick={onClick}>
						<span>{buttonText}</span>
						<Icon size={iconSize} className={`${iconStyle}`} />
					</button>
				)}
			</div>
			<div className='text-red-600 text-sm font-sans'>
				{hasError ? errorMessage : ""}
			</div>
		</>
	);
};

export default FormControl;
