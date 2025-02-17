import React from "react";
import LeafImage from "../../assets/images/features/feature-leaf.png";
import LeftImage from "../../assets/images/features/feature-left.png";
import RightImage from "../../assets/images/features/feature-right.png";
import featuresItems from "./featureItems";
import { GiLaserBurst } from "react-icons/gi";

const Features = () => {
  return (
    <section className='md:py-36 py-28 md:px-0 px-6'>
      <div className='grid lg:grid-cols-4 relative'>
        <div className='lg:relative absolute'>
          <div className='lg:w-fit md:w-2/3 w-1/3  overflow-hidden'>
            <img
              src={LeafImage}
              alt='Leaf'
              className='object-contain object-center'
            />
          </div>
          <div className='hidden lg:block mt-10 ms-4 w-fit p-4 border border-gray-200 rounded-tl-[50%] rounded-tr-[75%] rounded-br-[50%] rounded-bl-[75%] '>
            <img src={LeftImage} alt='Leaf' />
          </div>
        </div>
        <div className='xl:px-6 lg:px-4 md:px-2 col-span-2'>
          <div className='flex flex-col items-center gap-8 relative z-10'>
            <p className='text-[#799aa1] font-sans text-xl text-center'>
              What We Do
            </p>
            <p className='lg:text-7xl text-3xl font-serif text-center 2xl:w-1/2 w-full'>
              Quality & Natural Beauty Salon
            </p>
            <p className='absolute top-0 right-0 left-0 text-center -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
              Features
            </p>
          </div>
          <div className='grid md:grid-cols-2 gap-x-20 gap-y-10 mt-16'>
            {featuresItems.map((item, index) => {
              return (
                <div
                  key={index}
                  className='py-10 flex items-center gap-4 border-t border-t-gray-200 hover:border-t-black transition-all duration-700'>
                  <div className='rounded-full p-5 bg-[#f6e9e4]'>
                    <GiLaserBurst size={36} className='' />
                  </div>
                  <div>
                    <p className='font-serif text-black text-3xl mb-4 cursor-pointer hover:text-[#799aa1] transition-all duration-700'>
                      {item.title}
                    </p>
                    <p className='text-lg text-gray-600'>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className='hidden lg:block'>
          <div className=''>
            <img src={RightImage} alt='Leaf' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
