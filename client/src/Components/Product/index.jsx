import React from "react";
import { BsCartPlus } from "react-icons/bs";

const Product = ({ product }) => {
  return (
    <li key={product?.id}>
      <div className='cursor-pointer relative group mb-6'>
        <img
          src={product?.image}
          alt={product?.name}
          className='w-full h-full obejct-center object-cover'
        />

        {/* Sale */}
        {product?.isSale && (
          <div className='absolute top-2 left-2'>
            <p className='text-white bg-black px-2 py-3 text-center align-middle rounded-full'>
              Sale!
            </p>
          </div>
        )}

        {/* Add to cart */}
        <div className='transition-all duration-700 group-hover:opacity-100 opacity-0 cursor-pointer bg-[#779AA1] p-2.5 absolute top-1/2 left-1/2 -translate-x-1/2 group-hover:-translate-y-1/2 rounded-full'>
          <BsCartPlus size={24} className='text-white' />
        </div>
      </div>

      <div className='text-center'>
        <p className='text-2xl mb-2 font-serif cursor-pointer hover:text-[#779AA1] transition-all duration-700'>
          {product?.name}
        </p>
        <span className='flex items-center justify-center gap-2'>
          {product?.oldPrice && (
            <p className='text-zinc-400 line-through font-serif'>
              ${product?.oldPrice}
            </p>
          )}
          <p className='text-zinc-600 text-2xl font-serif'>${product?.price}</p>
        </span>
      </div>
    </li>
  );
};

export default Product;
