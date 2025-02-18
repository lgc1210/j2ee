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
  onChange,
  onBlur,
  onType,
  onClick,
}) => {
  return (
    <div
      className={`border border-zinc-500 flex items-center ${wrapInputStyle}`}>
      <input
        type={type}
        placeholder={placeHolder}
        className={`w-full h-full py-4 px-6 bg-transparent outline-none text-white ${inputStyle}`}
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
  );
};

export default FormControl;
