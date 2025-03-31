import React from "react";
import ContactItem from "./ContactItem";

import { FaLocationArrow } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const items = [
  {
    Icon: FaLocationArrow,
    title: "Location",
    description: "5 District, Ho Chi Minh City",
  },
  {
    Icon: MdOutlineAlternateEmail,
    title: "Email Us",
    description: "hotlineinfo@gmail.com",
  },
  {
    Icon: FaPhoneAlt,
    title: "Hotline",
    description: "Call: +012 *345) 7899",
  },
];

const ContactList = () => {
  return (
    <ul className='grid lg:grid-cols-3 md:grid-cols-2 gap-6'>
      {items.map((item, index) => {
        return <ContactItem key={index} contact={item} />;
      })}
    </ul>
  );
};

export default React.memo(ContactList);
