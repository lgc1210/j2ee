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
}) => {
  return (
    <div>
      {hasLabel && (
        <label
          htmlFor={id}
          className={`block text-sm/6 font-medium text-gray-900 ${labelStyle}`}>
          {label}
        </label>
      )}
      <div
        className={`border border-zinc-500 flex items-center ${wrapInputStyle}`}>
        <input
          type={type}
          id={id}
          placeholder={placeHolder}
          className={`w-full h-full py-4 px-6 bg-transparent outline-none ${inputStyle}`}
          onChange={onChange}
          onBlur={onBlur}
          onInput={onType}
        />
        {hasButton && (
          <button className={`${buttonStyle}`} onClick={onClick}>
            <span>{buttonText}</span>
            <Icon size={iconSize} className={`${iconStyle}`} />
          </button>
        )}
      </div>
      {hasError && (
        <div className='text-red-600 text-sm font-sans'>{errorMessage}</div>
      )}
    </div>
  );
};

export default FormControl;
