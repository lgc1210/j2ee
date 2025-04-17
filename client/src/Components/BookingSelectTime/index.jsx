import React from "react";
import { Button } from "antd";
import { FaArrowRightLong } from "react-icons/fa6";

const BookingSelectTime = ({ handleSetStep, handleInfoChange }) => {
  return (
    <section className='md:py-36 py-28 md:px-0 px-6'>
      <div className='container mx-auto '>
        {/* Header */}
        <div className='flex flex-col items-center gap-8 relative z-10'>
          <p className='text-[#799aa1] font-sans text-xl text-center'>
            Online Reservation
          </p>
          <p className='lg:text-7xl text-3xl font-serif text-center 2xl:w-1/2 w-full'>
            Booking
          </p>
          <p className='absolute top-0 right-0 left-0 text-center -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
            Calendar
          </p>
        </div>

        {/*  */}

        {/* Confirm */}
        <div className='mt-20'>
          <Button
            text='Confirm'
            Icon={FaArrowRightLong}
            iconSize={14}
            buttonStyle='justify-center gap-2 mt-10 mx-auto lg:[&]:py-6 lg:[&]:px-16 lg:[&]:text-lg'
            iconStyle=''
            onClick={handleSetStep}
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(BookingSelectTime);
