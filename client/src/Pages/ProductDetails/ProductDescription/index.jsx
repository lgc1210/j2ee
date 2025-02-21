import React, { useState } from "react";
import { FaRegStar } from "react-icons/fa";
import FormControl from "../../../Components/FormControl";
import { BsTable } from "react-icons/bs";

const DESCRIPTION = "DESCRIPTION";
const ADDITIONALINFORMATION = "ADDITIONALINFORMATION";
const REVIEWS = "REVIEWS";

const ProductDescription = ({ product }) => {
  const [tab, setTab] = useState(DESCRIPTION);

  return (
    <div className='mt-20'>
      <div className='flex items-center justify-start gap-6 border-b border-gray-300'>
        {/* Tabs */}
        <div
          className={`py-6 cursor-pointer transition-all duration-700 ${
            tab === DESCRIPTION
              ? "border-b-2 border-[#779AA1] text-[#779AA1]"
              : "text-gray-400"
          }`}
          onClick={() => setTab(DESCRIPTION)}>
          <p className='text-xl'>Description</p>
        </div>
        <div
          className={`py-6 cursor-pointer transition-all duration-700 ${
            tab === ADDITIONALINFORMATION
              ? "border-b-2 border-[#779AA1] text-[#779AA1]"
              : "text-gray-400"
          }`}
          onClick={() => setTab(ADDITIONALINFORMATION)}>
          <p className='text-xl'>Additional information</p>
        </div>
        <div
          className={`py-6 cursor-pointer transition-all duration-700 ${
            tab === REVIEWS
              ? "border-b-2 border-[#779AA1] text-[#779AA1]"
              : "text-gray-400"
          }`}
          onClick={() => setTab(REVIEWS)}>
          <p className='text-xl'>Reviews (0)</p>
        </div>
      </div>

      {/* Product's information */}
      <div className='py-16'>
        {/* Description */}
        {tab === DESCRIPTION && (
          <div>
            <p className='text-lg text-gray-500'>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
              ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
              non numquam eius modi tempora incidunt ut labore et dolore magnam
              aliquam quaerat voluptatem.
            </p>
          </div>
        )}

        {/* Additional information */}
        {tab === ADDITIONALINFORMATION && (
          <div className=''>
            <div className='flex items-center justify-start border-t border-gray-300 py-4'>
              <p className='min-w-40 text-xl font-light text-gray-500'>
                Weight
              </p>
              <p className='text-lg font-normal'>1kg</p>
            </div>
            <div className='flex items-center justify-start border-t border-gray-300 py-4'>
              <p className='min-w-40 text-xl font-light text-gray-500'>
                Dimensions
              </p>
              <p className='text-lg font-normal'>1 x 3 x 4 cm</p>
            </div>
            <div className='flex items-center justify-start border-t border-b border-gray-300 py-4'>
              <p className='min-w-40 text-xl font-light text-gray-500'>
                Colors
              </p>
              <p className='text-lg font-normal'>Blue, Black</p>
            </div>
          </div>
        )}

        {/* Reviews */}
        {tab === REVIEWS && (
          <div>
            <div className='mb-16'>
              <p className='text-lg font-sans text-gray-500'>
                There are no reviews yet.
              </p>
            </div>

            <form className='bg-gray-100 p-16'>
              <div className='flex flex-col gap-6'>
                <p className='font-serif text-2xl tracking-wider'>
                  Be the first to review “Beauty Care”
                </p>
                <p className='text-lg font-sans text-gray-500'>
                  Your email address will not be published. Required fields are
                  marked *
                </p>
                <span className='flex flex-col gap-2 text-lg font-sans text-gray-500'>
                  <p>Your rating *</p>
                  <span className='flex items-center justify-start gap-1'>
                    <FaRegStar size={18} />
                    <FaRegStar size={18} />
                    <FaRegStar size={18} />
                    <FaRegStar size={18} />
                    <FaRegStar size={18} />
                  </span>
                </span>
              </div>
              <div className='mt-10 flex flex-col gap-6'>
                <div>
                  {/* Chỗ này chưa sửa lại textarea */}
                  <FormControl
                    type='text'
                    wrapInputStyle='border-none shadow-md'
                    inputStyle='placeholder:text-lg text-black placeholder:font-serif bg-white py-6 font-serif'
                    hasLabel
                    label='Your Message *'
                    id='message'
                    labelStyle='mb-1 font-serif [&]:text-gray-500 [&]:text-lg'
                  />
                </div>
                <div>
                  <FormControl
                    type='text'
                    wrapInputStyle='border-none shadow-md'
                    inputStyle='placeholder:text-lg text-black placeholder:font-serif bg-white py-6 font-serif'
                    hasLabel
                    label='Name *'
                    id='name'
                    labelStyle='mb-1 font-serif [&]:text-gray-500 [&]:text-lg'
                  />
                </div>
                <div>
                  <FormControl
                    type='email'
                    wrapInputStyle='border-none shadow-md'
                    inputStyle='placeholder:text-lg text-black placeholder:font-serif bg-white py-6 font-serif'
                    hasLabel
                    label='Email *'
                    id='email'
                    labelStyle='mb-1 font-serif [&]:text-gray-500 [&]:text-lg'
                  />
                </div>
                <button
                  type='submit'
                  className='transition-all duration-700 hover:bg-black text-white bg-[#799aa1] w-full py-6 text-lg font-sans tracking-wider font-semibold'>
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
