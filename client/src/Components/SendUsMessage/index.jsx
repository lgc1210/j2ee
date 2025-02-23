import React, { useState } from "react";
import FormControl from "../FormControl";
import { FaRegUser } from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const SendUsMessage = () => {
  const [fields, setFields] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleFieldChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFieldType = (key) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFieldBlur = (key, message) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const validateFields = () => {
    const errs = {};

    setErrors(errors);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    // Do something here
  };
  return (
    <section>
      <form onSubmit={handleSubmit}>
        <p className='text-center font-serif text-6xl capitalize'>
          Send Us Message
        </p>
        <div className='flex flex-col gap-6 mt-12'>
          <div className='flex flex-wrap items-center justify-center gap-6 w-full'>
            <div className='flex-grow'>
              <FormControl
                type='email'
                placeHolder='Full Name'
                wrapInputStyle='[&]:border-gray-300'
                inputStyle='placeholder:text-lg placeholder:text-black text-lg text-black font-serif placeholder:font-serif'
                id='email'
                hasButton
                Icon={FaRegUser}
                iconSize={20}
                iconStyle='me-6 text-gray-500'
              />
            </div>
            <div className='flex-grow'>
              <FormControl
                type='email'
                placeHolder='Email Address'
                wrapInputStyle='[&]:border-gray-300'
                inputStyle='placeholder:text-lg placeholder:text-black text-lg text-black font-serif placeholder:font-serif'
                id='email'
                hasButton
                Icon={MdMailOutline}
                iconSize={20}
                iconStyle='me-6 text-gray-500'
              />
            </div>
            <div className='flex-grow'>
              <FormControl
                type='email'
                placeHolder='Phone Number'
                wrapInputStyle='[&]:border-gray-300'
                inputStyle='placeholder:text-lg placeholder:text-black text-lg text-black font-serif placeholder:font-serif'
                id='email'
                hasButton
                Icon={FaPhoneAlt}
                iconSize={18}
                iconStyle='me-6 text-gray-500'
              />
            </div>
          </div>
          <div className='w-full'>
            <FormControl
              type='textarea'
              placeHolder='Enter Message'
              pla
              wrapInputStyle='[&]:border-gray-300'
              inputStyle='placeholder:text-lg placeholder:text-black text-lg text-black font-serif placeholder:font-serif'
              id='email'
            />
          </div>
        </div>
        <div className='w-full text-center'>
          <button
            type='submit'
            className='mt-6 transition-all duration-700 hover:bg-black text-white bg-[#799aa1] lg:w-1/2 w-full py-4 text-lg font-serif font-semibold uppercase tracking-widest'>
            Send Message
          </button>
        </div>
      </form>
    </section>
  );
};

export default SendUsMessage;
