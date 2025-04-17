import React from 'react';
import { FaArrowRightLong } from "react-icons/fa6";

const BookingServiceItem = ({item}) => {
    return (
        <li key={item?.id}>
            <div className='p-4 rounded border flex flex-col gap-4'>
                <p className='text-2xl font-bold'>{item?.name}</p>
                <p className='text-white/65'>{item?.description}</p>
                <button className='rounded-full p-6'>
                    <FaArrowRightLong size={20}/>
                </button>
            </div>
        </li>
    );
};

export default BookingServiceItem;