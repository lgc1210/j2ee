import React from "react";
import aboutItems from "./aboutItems";
import serviceItems from "./serviceItems";
import contactItems from "./contactItem";
import FormControl from "../FormControl";

import {
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
} from "react-icons/fa6";
import { MdOutlineArrowRightAlt } from "react-icons/md";

const Footer = () => {
  return (
    <footer className='bg-zinc-800 w-full'>
      <div className='container mx-auto'>
        <div className='grid md:grid-cols-4 gap-10 py-20 md:px-0 px-6'>
          <div>
            <p className='text-2xl text-white font-serif mb-8'>About</p>
            <ul className='flex flex-col gap-4'>
              {aboutItems.map((item, index) => {
                return (
                  <li
                    key={index}
                    className='flex items-center gap-2 cursor-pointer group'>
                    <span className='text-[#799aa1] opacity-60 group-hover:opacity-100 transition-all duration-700'>
                      &#8226;
                    </span>
                    <p className='font-semibold font-sans text-lg text-zinc-400 group-hover:text-[#799aa1] group-hover:underline transition-all duration-700'>
                      {item.title}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p className='text-2xl text-white font-serif mb-8'>Services</p>
            <ul className='flex flex-col gap-4'>
              {serviceItems.map((item, index) => {
                return (
                  <li
                    key={index}
                    className='flex items-center gap-2 cursor-pointer group'>
                    <span className='text-[#799aa1] opacity-60 group-hover:opacity-100 transition-all duration-700'>
                      &#8226;
                    </span>
                    <p className='font-semibold font-sans text-lg text-zinc-400 group-hover:text-[#799aa1] group-hover:underline transition-all duration-700'>
                      {item.title}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p className='text-2xl text-white font-serif mb-8'>Contact</p>
            <ul className='flex flex-col gap-4'>
              {contactItems.map((item, index) => {
                return (
                  <li key={index} className='flex items-center gap-4'>
                    <item.Icon size={22} className='text-[#799aa1]' />
                    <div className=''>
                      <p className='text-white font-serif text-lg'>
                        {item.title}
                      </p>
                      <p className='text-zinc-400 font-semibold text-lg'>
                        {item.subTitle}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className=''>
            <p className='text-2xl text-white font-serif mb-8'>Newsletter</p>
            <FormControl
              placeHolder='Enter Email'
              wrapInputStyle='md:mb-20 mb-8'
              inputStyle='placeholder:text-white text-white placeholder:text-lg flex-1'
              iconStyle='text-white'
              buttonStyle='bg-[#799aa1] p-2 me-1'
              iconSize={30}
              Icon={MdOutlineArrowRightAlt}
              hasButton
            />
            <div className='flex items-center justify-start gap-2'>
              <span className='p-4 rounded-full cursor-pointer border border-zinc-500 bg-transparent hover:bg-[#799aa1] group transition-all duration-700'>
                <FaXTwitter
                  size={18}
                  className='text-zinc-500 group-hover:text-white transition-all duration-700'
                />
              </span>
              <span className='p-4 rounded-full cursor-pointer border border-zinc-500 bg-transparent hover:bg-[#799aa1] group transition-all duration-700'>
                <FaFacebookF
                  size={18}
                  className='text-zinc-500 group-hover:text-white transition-all duration-700'
                />
              </span>
              <span className='p-4 rounded-full cursor-pointer border border-zinc-500 bg-transparent hover:bg-[#799aa1] group transition-all duration-700'>
                <FaInstagram
                  size={18}
                  className='text-zinc-500 group-hover:text-white transition-all duration-700'
                />
              </span>
              <span className='p-4 rounded-full cursor-pointer border border-zinc-500 bg-transparent hover:bg-[#799aa1] group transition-all duration-700'>
                <FaPinterestP
                  size={18}
                  className='text-zinc-500 group-hover:text-white transition-all duration-700'
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='border-t border-zinc-600 py-10 md:px-0 px-6'>
        <div className='container mx-auto'>
          <div className='flex flex-wrap gap-10 items-center md:justify-between justify-center'>
            <div className='flex items-center gap-8'>
              <span className='text-zinc-400 text-lg cursor-pointer transition-all duration-700 hover:underline hover:text-white'>
                Pricing
              </span>
              <span className='text-zinc-400 text-lg cursor-pointer transition-all duration-700 hover:underline hover:text-white'>
                My Account
              </span>
              <span className='text-zinc-400 text-lg cursor-pointer transition-all duration-700 hover:underline hover:text-white'>
                Privacy
              </span>
              <span className='text-zinc-400 text-lg cursor-pointer transition-all duration-700 hover:underline hover:text-white'>
                Refund
              </span>
            </div>
            <div className='text-zinc-400 text-lg'>
              <span className='me-2'>&#169;</span>
              <span>2023 Lesya. All Rights Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
