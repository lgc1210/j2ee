import React from "react";
import Banner from "../../Components/Banner";
import ServiceImageBanner from "../../assets/images/banner/young-woman-visiting-masseur-spa-center.jpg";
import ServiceList from "../../Components/ServiceList";
import { FaPlus } from "react-icons/fa6";
import counters from "../../Components/Counter/counters";
import PopularService from "../../Components/PopularService";

const Service = () => {
  return (
    <section>
      <Banner
        imageBanner={ServiceImageBanner}
        titleBanner='Services'
        pathBanner='Services'
      />
      <div className='container mx-auto md:py-36 py-28 md:px-0 px-6'>
        <div className='flex flex-col items-center gap-8 relative z-10'>
          <p className='text-[#799aa1] font-sans text-xl text-center'>
            What We Offer
          </p>
          <p className='lg:text-7xl text-3xl font-serif text-center 2xl:w-1/2 w-full'>
            Quality Spa & Beauty Treatments
          </p>
          <p className='absolute top-0 right-0 left-0 text-center -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
            Services
          </p>
        </div>
        <div className='py-32'>
          <ServiceList />
        </div>
      </div>
      <div className='bg-[#779AA1] py-16'>
        <div className='container mx-auto md:px-0 px-6'>
          <div className='flex flex-wrap md:flex-row flex-col md:items-center gap-10 md:ms-0 ms-8'>
            {counters.map((counter, index) => {
              return (
                <span key={index} className='flex-grow relative'>
                  <p className='font-sans text-5xl text-white'>
                    {counter.count}
                  </p>
                  <p className='font-sans mt-2 text-xl text-white'>
                    {counter.text}
                  </p>
                  <div>
                    <FaPlus
                      size={20}
                      className='text-white absolute top-0 -left-6'
                    />
                  </div>
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <PopularService />
    </section>
  );
};

export default Service;
