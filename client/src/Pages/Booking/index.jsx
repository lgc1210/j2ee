import React, { useState, lazy, Suspense } from "react";
import Loading from "../../Components/Loading";
import { useAuth } from "../../Contexts/Auth";

const BookingSelectDate = lazy(() =>
  import("../../Components/BookingSelectDate")
);
const BookingSelectTime = lazy(() =>
  import("../../Components/BookingSelectTime")
);
const StoresChoosingWrap = lazy(() =>
  import("../../Components/StoresChoosingWrap")
);

const Booking = () => {
  const [step, setStep] = useState(1);
  const { isAuthenticated, user } = useAuth();
  const [info, setInfo] = useState({
    appointment_date: null,
    appointment_time: null,
    status: "Pending",
    customer_id: isAuthenticated ? user?.id : null,
    service_id: null,
    staff_id: null,
    store_id: null,
  });

  const handleSelectStore = () => {
    handleSetStep(2);
  };

  const handleInfoChange = (key, value) => {
    setInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleSetStep = (step) => setStep(step);

  return (
    <Suspense
      fallback={
        <Loading
          size='h-16 w-16'
          customStyle='w-full h-screen flex flex-col items-center justify-center'
          hasLoadingText
        />
      }>
      {step === 1 && (
        <StoresChoosingWrap
          handleSelectStore={handleSelectStore}
          handleInfoChange={handleInfoChange}
        />
      )}
      {step === 2 && (
        <BookingSelectDate
          handleSetStep={handleSetStep}
          handleInfoChange={handleInfoChange}
        />
      )}
      {step === 3 && (
        <BookingSelectTime
          handleSetStep={handleSetStep}
          handleInfoChange={handleInfoChange}
        />
      )}
    </Suspense>
  );
};

export default Booking;
