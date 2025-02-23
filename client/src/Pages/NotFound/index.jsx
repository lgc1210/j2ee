import React, { useNavigate } from "react-router-dom";
import paths from "../../Constants/paths";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <p className='text-2xl font-semibold text-[#779AA1] font-serif'>404</p>
        <h1 className='mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl font-serif'>
          Page not found
        </h1>
        <p className='mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8 font-serif'>
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <button
            onClick={() => {
              navigate(paths.home);
            }}
            className='transition-all duration-700 font-serif rounded-md bg-[#779AA1] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            Go back home
          </button>
          <button
            onClick={() => {
              navigate(paths.home);
            }}
            className='font-serif text-sm font-semibold text-gray-900 hover:text-[#779AA1] transition-all duration-700'>
            Contact support <span aria-hidden='true'>&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
