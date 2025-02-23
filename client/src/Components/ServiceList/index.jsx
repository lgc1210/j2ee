import React from "react";
import items from "./items";
import Service from "../../Components/Service";

const ServiceList = () => {
  return (
    <ul className='grid lg:grid-cols-3 md:grid-cols-2 gap-x-10 gap-y-36'>
      {items.map((item, index) => {
        return <Service key={index} service={item} />;
      })}
    </ul>
  );
};

export default ServiceList;
