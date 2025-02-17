import React from "react";
import HeroImage from "../../assets/images/hero/hero-1.jpg";
import Button from "../Button";

import { FaArrowRightLong } from "react-icons/fa6";

const Hero = () => {
  return (
    <section className='bg-[#f6e9e4] w-full min-h-[840px] relative flex flex-wrap md:flex-row flex-col items-center md:justify-center'>
      <div className='container mx-auto flex-1 md:flex-row flex-col md:block flex items-center justify-center md:px-0 px-6'>
        <div className='flex items-center md:justify-start justify-center'>
          <div className='relative z-10'>
            <p className='capitalize md:text-8xl text-5xl font-serif max-w-full md:w-2/3'>
              Health Care & Beauty Salon
            </p>
            <p className='absolute -z-10 bottom-20 left-0 text-center text-8xl sm:text-9xl md:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
              Beauty
            </p>
          </div>
        </div>
        <Button
          text='Learn More'
          Icon={FaArrowRightLong}
          iconSize={14}
          buttonStyle='justify-center gap-2 mt-10 me-auto'
          iconStyle=''
        />
      </div>
      <div
        style={{
          backgroundImage: `url('${HeroImage}')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className='md:absolute md:top-0 md:right-0 md:w-1/2 md:h-full h-96 w-full overflow-hidden'></div>
    </section>
  );
};

export default Hero;
