import React from "react";
import Image from "../../assets/images/services/spa-massage-skills-2.jpg";
const PopularService = () => {
  return (
    <section>
      <div className='container mx-auto md:py-36 py-28 md:px-0 px-6'>
        <div className='grid md:grid-cols-2 gap-10'>
          <div className='w-full h-full'>
            <img
              src={Image}
              alt='Spa Thumbnail'
              className='w-full h-full object-contain object-center'
            />
          </div>
          <div>
            <div className='flex flex-col items-center gap-4 relative z-10'>
              <p className='text-[#799aa1] font-sans text-xl text-left me-auto'>
                Popular Service
              </p>
              <p className='lg:text-7xl text-3xl font-serif text-left w-full'>
                Beauty Treatments
              </p>
              <p className='absolute top-0 right-0 left-0 text-center -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
                Offers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularService;
