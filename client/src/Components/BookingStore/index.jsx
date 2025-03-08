import React from "react";

const BookingStore = ({ store, onClick }) => {
  return (
    <li>
      <div className='group' onClick={onClick}>
        {/* Store's thumbnail */}
        <div className='w-full h-full max-h-72 overflow-hidden relative shadow-lg group-hover:shadow-none transition-all duration-700'>
          <img
            src={store.imageUrl}
            alt={store.name}
            className='transition-all duration-700 group-hover:scale-[1.15] w-full h-full object-center object-cover'
          />

          {/* Store's information */}
          <div className='absolute left-0 bottom-0'>
            <p className='font-sans font-semibold text-2xl p-4 text-amber-500 tracking-wider leading-none '>
              {store?.name}
            </p>
          </div>

          {/* Store's tag */}
          <div className='absolute left-0 top-0 mt-2'>
            <button className='shadow-md font-sans font-semibold text-lg py-1 px-1.5 text-white bg-[#779AA1] rounded-tr-md rounded-br-md'>
              Shop now
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BookingStore;
