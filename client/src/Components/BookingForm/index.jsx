import React, { useState } from "react";
import { Alert, Calendar } from "antd";
import dayjs from "dayjs";
import { FaArrowRightLong } from "react-icons/fa6";
import Button from "../../Components/Button";

const BookingForm = () => {
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(() => dayjs("2017-01-25"));
  const [selectedValue, setSelectedValue] = useState(() => dayjs("2017-01-25"));

  const handleFieldsChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFieldsType = (key) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handelFieldsBlur = (key, message) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const validateFields = () => {
    const errs = {};

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    // Do something related to booking here
  };

  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <section className='md:py-36 py-28 md:px-0 px-6'>
      <div className='container mx-auto '>
        {/* Header */}
        <div className='flex flex-col items-center gap-8 relative z-10'>
          <p className='text-[#799aa1] font-sans text-xl text-center'>
            Online Reservation
          </p>
          <p className='lg:text-7xl text-3xl font-serif text-center 2xl:w-1/2 w-full'>
            Booking
          </p>
          <p className='absolute top-0 right-0 left-0 text-center -translate-y-1/3 leading-none font-sans text-7xl md:text-9xl lg:text-[250px] text-[rgba(0,0,0,.04)] capitalize font-bold'>
            Calendar
          </p>
        </div>

        {/* Calendar */}
        <div className='mt-20'>
          <Alert
            message={`You selected date: ${selectedValue?.format(
              "YYYY-MM-DD"
            )}`}
          />
          <Calendar
            value={value}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
          />
          <Button
            text='Confirm'
            Icon={FaArrowRightLong}
            iconSize={14}
            buttonStyle='justify-center gap-2 mt-10 mx-auto lg:[&]:py-6 lg:[&]:px-16 lg:[&]:text-lg'
            iconStyle=''
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(BookingForm);
