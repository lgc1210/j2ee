import React from "react";
import { MdArrowRightAlt } from "react-icons/md";

const Service = ({ service }) => {
  return (
    <li className=''>
      <div className='relative group cursor-pointer'>
        <div className='w-full h-80 overflow-hidden'>
          <img
            src={service.image}
            alt={service.title}
            className='w-full h-full object-cover object-center'
          />
        </div>
        <div className='absolute bg-white shadow-lg z-10 -bottom-1/2 -translate-y-1/2 right-0 left-0 mx-8 p-8 group-hover:-translate-y-2/3 transition-all duration-700'>
          <p className='text-center font-serif lg:text-2xl md:text-xl text-lg tracking-widest transition-all duration-700 hover:text-[#779AA1]'>
            {service.title}
          </p>
          <button className='flex items-center justify-center gap-1 w-full mt-2 text-base lg:text-lg text-gray-500 hover:gap-2.5 hover:text-black transition-all duration-700'>
            <p className='uppercase font-sans tracking-wider'>Read More</p>
            <MdArrowRightAlt />
          </button>
        </div>
      </div>
    </li>
  );
};

export default Service;
