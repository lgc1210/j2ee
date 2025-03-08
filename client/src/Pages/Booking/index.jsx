import React, { useState, lazy, Suspense } from "react";
import Loading from "../../Components/Loading";

const BookingForm = lazy(() => import("../../Components/BookingForm"));
const StoresChoosingWrap = lazy(() =>
  import("../../Components/StoresChoosingWrap")
);

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
        <StoresChoosingWrap handleSelectStore={handleSelectStore} />
      )}
    </Suspense>
  );
};

export default Booking;
