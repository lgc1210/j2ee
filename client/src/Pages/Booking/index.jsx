import React, { useState, lazy, Suspense } from "react";
import BookingImageBanner from "../../assets/images/Booking/female-hairstylist-drying-curly-girl-s-hair-using-big-plastic-brush-1920x1282.jpeg";
import Loading from "../../Components/Loading";

const Banner = lazy(() => import("../../Components/Banner"));
const BookingHeader = lazy(() => import("../../Components/BookingHeader"));
const BookingStores = lazy(() => import("../../Components/BookingStores"));
const Pagination = lazy(() => import("../../Components/Pagination"));
const BookingForm = lazy(() => import("../../Components/BookingForm"));

const Booking = () => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSelectStore = () => {
    setShowCalendar(true);
  };

  return (
    <Suspense
      fallback={
        <Loading
          size='h-16 w-16'
          customStyle='w-full h-screen flex flex-col items-center justify-center'
          hasLoadingText
        />
      }>
      {showCalendar ? (
        <BookingForm />
      ) : (
        <section>
          <Banner
            imageBanner={BookingImageBanner}
            titleBanner='Online Booking'
            pathBanner='Booking'
          />

          <BookingHeader />

          <div className='container mx-auto py-20 md:px-0 px-6'>
            <p className='mb-10 font-serif text-2xl'>
              Find a store for your service
            </p>
            <BookingStores onClick={handleSelectStore} />
            <div className='flex items-center justify-between mt-6'>
              <Pagination />
              <p className='font-sans text-xl'>
                For any questions, please reach out to{" "}
                <span>
                  <a
                    href='mailto:support@gmail.com'
                    className='font-bold text-[#779AA1]'>
                    support@gmail.com
                  </a>
                </span>
              </p>
            </div>
          </div>
        </section>
      )}
    </Suspense>
  );
};

export default Booking;
