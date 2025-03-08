import React from "react";
import { useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";

const Banner = ({ imageBanner, titleBanner, pathBanner }) => {
  const navigate = useNavigate();

  return (
    <section className='relative'>
      <div
        className='before:bg-black before:opacity-30 before:content-[""] before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-10 bg-cover bg-center bg-no-repeat  min-h-[480px] flex flex-col items-center justify-center'
        style={{ backgroundImage: `url("${imageBanner}")` }}>
        <div className='flex flex-col items-center gap-8 relative z-10'>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-white lg:text-7xl text-3xl font-serif text-center w-full'>
              {titleBanner}
            </p>
            <p className='mt-6 text-white w-full text-center flex items-center justify-center gap-3 text-xl font-sans'>
              <span
                className='cursor-pointer transition-all duration-700 hover:text-black'
                onClick={() => navigate(paths.home)}>
                Home
              </span>
              <span className='text-3xl'>&#8226;</span>
              <span>{pathBanner}</span>
            </p>
          </div>
          <p className='-z-10 absolute top-0 md:-left-1/2 text-center -translate-y-1/2 md:-translate-x-1/4 font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
            {titleBanner}
          </p>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Banner);
