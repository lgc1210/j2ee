import React, { useState } from "react";
import slideItems from "./slideItems";
import LeftImage from "../../assets/images/feedback/testimonial-left.jpg";
import LeafImage from "../../assets/images/feedback/feedback-leaf.png";

const Feedback = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className='md:py-36 py-28 lg:px-20 px-6'>
      <div className='bg-[#f6e9e4]'>
        <div className='grid md:grid-cols-2'>
          {/* Right */}
          <div className='w-full'>
            <img
              src={LeftImage}
              alt='Feedback'
              className='w-full h-full object-cover object-center'
            />
          </div>
          {/* Left */}
          <div className='flex items-center justify-center w-full relative'>
            <div className='flex flex-col items-center gap-8 relative z-10 w-full'>
              {/* Background text */}
              <p className='absolute top-0 right-0 left-0 text-center lg:-translate-y-2/3 translate-y-2/3 leading-none font-sans text-7xl md:text-7xl lg:text-9xl text-[rgba(0,0,0,.04)] capitalize font-bold w-full'>
                Feedback
              </p>

              {/* Carousel */}
              <div className='relative lg:p-0 p-10'>
                <div className='overflow-hidden'>
                  <div className='transition-all duration-1000 ease-in-out'>
                    <div className='flex flex-col items-center justify-center max-w-2xl m-auto'>
                      <p className='text-xl md:text-2xl font-serif mb-8 text-center'>
                        {slideItems[currentSlide].content}
                      </p>
                      <div>
                        <img
                          src={slideItems[currentSlide].imageSource}
                          alt='Feedback'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dots */}
                <div className='flex justify-center gap-2 mt-6'>
                  {slideItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentSlide === index ? "bg-black w-4" : "bg-black/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Leaf */}
            <div className='absolute bottom-0 lg:right-40 md:right-20 right-10 lg:w-32 md:w-20 w-14 h-auto'>
              <img
                src={LeafImage}
                alt='Leaf'
                className='w-full h-full object-contain object-center z-20'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
