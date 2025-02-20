import React from "react";
import { IoIosArrowDown } from "react-icons/io";

const SortingProduct = () => {
  return (
    <div className='flex items-center justify-between'>
      <div className=''>
        <p className='text-zinc-500 text-xl font-sans'>Showing all 6 results</p>
      </div>
      <div className='cursor-pointer flex items-center gap-2'>
        <p className='text-xl text-zinc-700'>Default sorting</p>
        <IoIosArrowDown size={20} />
      </div>
    </div>
  );
};

export default SortingProduct;
