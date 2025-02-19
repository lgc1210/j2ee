import React from "react";
import Button from "../../Components/Button";
import { FaArrowRightLong } from "react-icons/fa6";
import workItems from "./workItems";

const Works = () => {
  return (
    <section className='md:py-36 py-28 md:px-0 px-6'>
      <div className='container mx-auto'>
        <div className='flex flex-col items-center gap-8 relative z-10'>
          <p className='text-[#799aa1] font-sans text-xl text-center'>
            Portfolio
          </p>
          <p className='lg:text-7xl text-3xl font-serif text-center 2xl:w-1/2 w-full'>
            Our Latest Works
          </p>
          <p className='absolute top-0 right-0 left-0 text-center -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
            Works
          </p>
        </div>
        <div className='mt-40'>
          <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-8'>
            {workItems.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`flex flex-col gap-8 ${
                    index === 1 ? "md:-mt-24 h-fit" : ""
                  }`}>
                  <div className='overflow-hidden h-full relative group max-h-[420px]'>
                    <img
                      src={item.sourceImageTop}
                      alt={item.titleTop}
                      className='w-full h-full object-center object-cover cursor-pointer'
                    />
                    <div className='absolute bottom-0 right-0 left-0 p-6 translate-x-full group-hover:-translate-x-0 transition-all duration-700'>
                      <div className='bg-white p-6'>
                        <p className='text-center text-2xl font-serif cursor-pointer hover:text-[#799AA1] transition-all duration-700'>
                          {item.titleTop}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='overflow-hidden h-full relative group max-h-[420px]'>
                    <img
                      src={item.sourceImageBottom}
                      alt={item.titleBottom}
                      className='w-full h-full object-center object-cover cursor-pointer'
                    />
                    <div className='absolute bottom-0 right-0 left-0 p-6 translate-x-full group-hover:-translate-x-0 transition-all duration-700'>
                      <div className='bg-white p-6'>
                        <p className='text-center text-2xl font-serif cursor-pointer hover:text-[#799AA1] transition-all duration-700'>
                          {item.titleBottom}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            text='View More'
            Icon={FaArrowRightLong}
            iconSize={14}
            buttonStyle='justify-center gap-2 mt-10 mx-auto'
            iconStyle=''
          />
        </div>
      </div>
    </section>
  );
};

export default Works;
