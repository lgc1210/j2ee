import React from "react";

const ContactItem = ({ contact }) => {
  return (
    <li className='flex flex-col items-center gap-4 w-full h-full py-14 bg-gray-50 border border-gray-200'>
      <div className='p-10 rounded-full bg-white'>
        <contact.Icon className='text-[#799aa1]' size={42} />
      </div>
      <p className='text-3xl font-serif text-center'>{contact.title}</p>
      <p className='text-gray-400 text-lg text-center'>{contact.description}</p>
    </li>
  );
};

export default ContactItem;
