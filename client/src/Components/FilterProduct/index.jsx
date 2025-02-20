import React from "react";
import FormControl from "../FormControl";
import { IoSearch } from "react-icons/io5";

const FilterProduct = () => {
  return (
    <section>
      {/* Search products */}
      <FormControl
        type='text'
        placeHolder='Search products...'
        wrapInputStyle='border-t-0 border-r-0 border-l-0 [&]:border-b'
        inputStyle='px-0 text-xl font-[Manrope] placeholder:text-xl placeholder:text-zinc-600 placeholder:text-black placeholder:font-[Manrope]'
        hasButton
        Icon={IoSearch}
        iconSize={24}
        iconStyle='text-[#799AA1]'
      />

      {/* Category */}
      <div className='mt-14'>
        <div>
          <p className='text-xl font-serif text-zinc-600'>Category</p>
          <div className='w-full border-b border-b-gray-200 mt-2'>
            <div className='max-w-12 h-0.5 border-b-[3px] border-b-[#779AA1]'></div>
          </div>
        </div>

        <ul className='flex flex-col items-start gap-2 mt-8'>
          <li>
            <p className='text-xl font-sans font-normal text-zinc-700 hover:text-[#779AA1] cursor-pointer transition-all duration-700'>
              Face <span className='text-zinc-500 font-'>(4)</span>
            </p>
          </li>
          <li>
            <p className='text-xl font-sans font-normal text-zinc-700 hover:text-[#779AA1] cursor-pointer transition-all duration-700'>
              Organic <span className='text-zinc-500'>(6)</span>
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default FilterProduct;
