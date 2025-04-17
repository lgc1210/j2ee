import React from 'react';
import BookingServiceItem from '../BookingServiceItem';

const BookingServiceList = ({serviceList}) => {
    return (
        <ul>
            {serviceList?.map(service=>(
                <BookingServiceItem key={service?.id} item={service}/>
            ))}
        </ul>
    );
};

export default BookingServiceList;