import React, { useState } from "react";
import { Alert, Calendar, ConfigProvider } from "antd";
import dayjs from "dayjs";
import { FaArrowRightLong } from "react-icons/fa6";
import Button from "../Button";
import "./index.css";

const BookingForm = ({ handleSetStep }) => {
  const [value, setValue] = useState(() => dayjs(Date.now()));
  const [selectedValue, setSelectedValue] = useState(() => dayjs(Date.now()));

  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue) => {
    setValue(newValue);
  };

  const dateFullCellRender = (date) => {
    const day = date.date();
    const isSelected =
      selectedValue &&
      day === selectedValue.date() &&
      date.month() === selectedValue.month() &&
      date.year() === selectedValue.year();

    return (
      <div
        style={{
          textAlign: "center",
          height: "10rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          border: "1px #fafafa solid",
          ...(isSelected && {
            background: "#fff",
            border: "1px #ccc solid",
            margin: "auto",
            position: "relative",
          }),
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = "#e6e6e6";
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = "#f5f5f5";
          }
        }}>
        {isSelected && (
          <div
            style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              border: "2px #000 solid",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: -1,
            }}
          />
        )}
        <span style={{ position: "relative", zIndex: 1 }}>{day}</span>
      </div>
    );
  };

  const headerRender = ({ value }) => (
    <div
      style={{
        background: "#383838",
        color: "#fff",
        fontSize: "1.1rem",
        fontStyle: "uppercase",
        padding: "18px",
        textAlign: "center",
        letterSpacing: "0.1rem",
        textTransform: "uppercase",
      }}>
      {value.format("MMMM YYYY")}
    </div>
  );

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
          <ConfigProvider
            theme={{
              components: {
                Calendar: {
                  colorBgContainer: "#f5f5f5",
                  colorBgHeader: "#333",
                  colorTextHeading: "#fff",
                  fullPanelHeaderTextAlign: "center",
                  fullPanelHeaderPadding: "8px 0",
                },
              },
            }}>
            <Calendar
              value={value}
              onSelect={onSelect}
              onPanelChange={onPanelChange}
              fullCellRender={dateFullCellRender}
              headerRender={headerRender}
              className='custom-calendar'
            />
          </ConfigProvider>
          <Button
            text='Next'
            Icon={FaArrowRightLong}
            iconSize={14}
            buttonStyle='justify-center gap-2 mt-10 mx-auto lg:[&]:py-6 lg:[&]:px-16 lg:[&]:text-lg'
            iconStyle=''
            onClick={handleSetStep}
          />
        </div>
      </div>
    </section>
  );
};

export default React.memo(BookingForm);
