import React from "react";
import { FaArrowRightLong, FaCheck } from "react-icons/fa6";
import AboutImage from "../../assets/images/about/about-left.jpg";
import Button from "../../Components/Button";

const About = () => {
  return (
    <section className='md:py-36 py-28 md:px-0 px-6'>
      <div className='container mx-auto'>
        <div className='grid lg:grid-cols-2 gap-20'>
          <div className='overflow-hidden'>
            <img
              src={AboutImage}
              alt='About'
              className='object-contain object-center ms-auto lg:w-fit w-full'
            />
          </div>
          <div className='relative z-10 flex flex-col gap-8'>
            <p className='text-[#799aa1] font-sans text-xl'>Who We Are</p>
            <p className='lg:text-7xl text-3xl font-serif'>
              Quality & Natural Beauty Salon
            </p>
            <p className='md:w-2/3 w-full text-lg text-gray-600'>
              Sed ut persiciatis unde omnis iste natus error sit voluptate
              maccusantium doloremque laudantium, totam rem aperiam eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explic aboemo enim ipsa
            </p>
            <div className='flex flex-col gap-4'>
              <span className='flex items-center justify-start gap-2'>
                <FaCheck
                  size={30}
                  className='rounded-full p-2 text-gray-600 bg-[#f6e9e4]'
                />
                <p className='text-gray-600 text-lg'>Natural Beauty Salon</p>
              </span>
              <span className='flex items-center justify-start gap-2'>
                <FaCheck
                  size={30}
                  className='rounded-full p-2 text-gray-600 bg-[#f6e9e4]'
                />
                <p className='text-gray-600 text-lg'>
                  Professional Women Spa Service
                </p>
              </span>
              <span className='flex items-center justify-start gap-2'>
                <FaCheck
                  size={30}
                  className='rounded-full p-2 text-gray-600 bg-[#f6e9e4]'
                />
                <p className='text-gray-600 text-lg'>
                  Experience Hair Treatments
                </p>
              </span>
            </div>
            <Button
              text='Learn More'
              Icon={FaArrowRightLong}
              iconSize={14}
              buttonStyle='justify-center gap-2 mt-10 me-auto'
              iconStyle=''
              reverse
            />
            <p className='absolute top-0 right-0 left-0 -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
              About
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
