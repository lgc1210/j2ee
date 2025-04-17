import React from "react";

const FormControl  = React.lazy(()=>import( "../FormControl"));

const BookingHeader = ({ selectedService, setSelectedService }) => {
  return (
    <section className='w-full h-20 border-b bg-gray-100'>
      <div className='md:px-0 px-6 w-full h-full'>
        <div className='container mx-auto w-full h-full'>
          <div className='w-full h-full flex items-center justify-between'>
            <p className='text-lg font-serif font-semibold text-[#779AA1]'>
              Stores All
            </p>
            <div>
              <FormControl
                type='select'
                id='service'
                label='Chọn dịch vụ'
                inputStyle='appearance-none cursor-pointer'
                options={[
                  { value: "", label: "Select service" },
                  { value: "haircut", label: "Hair cut" },
                  { value: "spa", label: "Spa" },
                  { value: "nail", label: "Nail" },
                ]}
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(BookingHeader);
