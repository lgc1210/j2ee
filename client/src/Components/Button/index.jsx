import React from "react";

const Button = ({
  text = "",
  Icon,
  iconSize = 20,
  buttonStyle = "",
  iconStyle = "",
  textStyle = "",
  onClick,
}) => {
  return (
    <button
      className={`
        flex items-center 
        py-4 px-10 
        border border-black 
        uppercase text-sm font-semibold tracking-widest 
        relative 
        group 
        overflow-hidden 
        transition-all duration-700 ease-linear
        ${buttonStyle}`}
      onClick={onClick}>
      <p
        className={`
        relative z-10 
        transition-all duration-700 ease-linear
        text-black group-hover:text-white
        ${textStyle}`}>
        {text}
      </p>
      <Icon
        size={iconSize}
        className={`
        relative z-10 
        transition-all duration-700 ease-linear
        text-black group-hover:text-white
        
        ${iconStyle}`}
      />
      <span
        className={`
        absolute 
        top-0 bottom-0 right-0 left-0 
        transition-all duration-700 ease-linear 
        bg-black
        -translate-x-full group-hover:translate-x-0
        `}></span>
      <span
        className={`
        absolute 
        top-0 bottom-0 right-0 left-0 
        transition-all duration-700 ease-linear 
        bg-black
        translate-x-full group-hover:translate-x-0
        `}></span>
    </button>
  );
};

export default Button;
